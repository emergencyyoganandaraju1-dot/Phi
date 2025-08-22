import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buildContext } from '@/lib/search'
import { SYSTEM_PROMPT } from '@/lib/identity'
import { streamChatCompletion } from '@/lib/llm'

export const runtime = 'nodejs'

function sseEncode(data: any) {
	return `data: ${JSON.stringify(data)}\n\n`
}

export async function POST(req: NextRequest) {
	const { chatId, message } = await req.json()
	if (!message || typeof message !== 'string') {
		return new Response('Bad Request', { status: 400 })
	}
	// Ensure chat
	let chat = chatId ? await prisma.chat.findUnique({ where: { id: chatId } }) : null
	if (!chat) {
		chat = await prisma.chat.create({ data: { title: message.slice(0, 60) } })
	}
	// Past messages
	const history = await prisma.message.findMany({ where: { chatId: chat.id }, orderBy: { createdAt: 'asc' } })

	const encoder = new TextEncoder()
	const readable = new ReadableStream<Uint8Array>({
		start(controller) {
			(async () => {
				try {
					// RAG context
					const { context, docs } = await buildContext(message)
					controller.enqueue(encoder.encode(sseEncode({ type: 'meta', chatId: chat!.id, citations: docs })))

					// Compose messages for LLM
					const messages = [
						{ role: 'system', content: SYSTEM_PROMPT },
						...history.map(m => ({ role: m.role as any, content: m.content })),
						{ role: 'user', content: `User Query: ${message}\n---\nSources Context (may be empty):\n${context}\n\nInstructions: Use the context when present. Cite as [n] inline. At the end, list full Sources with URLs.` }
					] as any

					// Persist user message immediately
					const userMsg = await prisma.message.create({ data: { chatId: chat!.id, role: 'user', content: message } })

					let assistantContent = ''
					let thinking = ''
					await streamChatCompletion({
						messages,
						handler: {
							onToken: (t) => {
								assistantContent += t
								controller.enqueue(encoder.encode(sseEncode({ type: 'token', token: t })))
							},
							onThinking: (r) => {
								thinking += r
								controller.enqueue(encoder.encode(sseEncode({ type: 'thinking', chunk: r })))
							}
						}
					})

					await prisma.message.create({ data: { chatId: chat!.id, role: 'assistant', content: assistantContent, thinking } })
					controller.enqueue(encoder.encode(sseEncode({ type: 'done' })))
					controller.close()
				} catch (e: any) {
					controller.enqueue(encoder.encode(sseEncode({ type: 'error', error: e?.message || 'error' })))
					controller.close()
				}
			})()
		}
	})

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			'Connection': 'keep-alive'
		}
	})
}