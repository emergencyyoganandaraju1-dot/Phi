import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
	const token = req.headers.get('x-admin-token')
	if (token !== process.env.ADMIN_TOKEN) return new Response('Unauthorized', { status: 401 })
	const chats = await prisma.chat.count()
	const msgs = await prisma.message.count()
	const likes = await prisma.feedback.count({ where: { type: 'like' } })
	const dislikes = await prisma.feedback.count({ where: { type: 'dislike' } })
	const events = await prisma.analyticsEvent.count()
	const credits = await prisma.credits.findFirst()
	return Response.json({ chats, messages: msgs, likes, dislikes, events, credits })
}