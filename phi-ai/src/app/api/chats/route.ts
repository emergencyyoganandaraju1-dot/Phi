import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
	const chats = await prisma.chat.findMany({ orderBy: { updatedAt: 'desc' } })
	return Response.json(chats)
}

export async function POST(req: NextRequest) {
	const { title } = await req.json()
	const chat = await prisma.chat.create({ data: { title: title || 'New Chat' } })
	return Response.json(chat)
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const id = searchParams.get('id')!
	if (!id) return new Response('Bad Request', { status: 400 })
	await prisma.chat.delete({ where: { id } })
	return new Response('ok')
}