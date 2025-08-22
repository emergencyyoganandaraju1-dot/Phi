import ChatClient from '@/components/chat/ChatClient'

export default function ChatIdPage({ params }: { params: { id: string } }) {
	return <ChatClient chatId={params.id} />
}