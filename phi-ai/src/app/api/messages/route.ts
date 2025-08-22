import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const chatId = searchParams.get('chatId')
	if (!chatId) return new Response('Bad Request', { status: 400 })
	const messages = await prisma.message.findMany({ where: { chatId }, orderBy: { createdAt: 'asc' } })
	return Response.json(messages)
}

export async function POST(req: NextRequest) {
	const { messageId, type, comment } = await req.json()
	await prisma.feedback.create({ data: { messageId, type, comment } })
	return new Response('ok')
}