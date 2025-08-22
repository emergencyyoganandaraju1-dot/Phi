import OpenAI from 'openai'
import { Readable } from 'node:stream'

const preferred = (process.env.OPENROUTER_PREFERRED_MODELS || 'deepseek/deepseek-chat,meta-llama/llama-3.1-70b-instruct')
	.split(',')
	.map(m => m.trim())

export function createOpenRouter() {
	return new OpenAI({
		apiKey: process.env.OPENROUTER_API_KEY!,
		baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
	})
}

export type StreamHandler = {
	onToken?: (token: string) => void
	onThinking?: (chunk: string) => void
}

export async function streamChatCompletion(opts: {
	modelPref?: string[]
	messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
	handler: StreamHandler
}) {
	const client = createOpenRouter()
	const models = opts.modelPref && opts.modelPref.length > 0 ? opts.modelPref : preferred
	let lastError: unknown
	for (const model of models) {
		try {
			const stream = await client.chat.completions.create({
				model,
				messages: opts.messages,
				stream: true,
				// request reasoning tokens if model supports
				reasoning: { effort: 'medium' } as any,
			})
			for await (const part of stream) {
				const delta = part.choices?.[0]?.delta
				const text = delta?.content ?? ''
				if (text) opts.handler.onToken?.(text)
				const thinking = (delta as any)?.reasoning_content
				if (thinking) opts.handler.onThinking?.(thinking)
			}
			return
		} catch (err) {
			lastError = err
			continue
		}
	}
	throw lastError || new Error('All models failed')
}