"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import MDX from '@/components/MDX'
import { HandThumbUpIcon, HandThumbDownIcon, ArrowPathIcon, TrashIcon, ShareIcon, ClipboardIcon, PlusIcon } from '@heroicons/react/24/outline'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Message = { id: string; role: string; content: string; thinking?: string | null; createdAt: string }

type Citation = { title: string; url: string; snippet: string }

export default function ChatClient({ chatId: initialId }: { chatId?: string }) {
	const [chatId, setChatId] = useState<string | undefined>(initialId)
	const { data: chats, mutate: refreshChats } = useSWR('/api/chats', fetcher)
	const { data: messages, mutate: refreshMessages } = useSWR(chatId ? `/api/messages?chatId=${chatId}` : null, fetcher)
	const [input, setInput] = useState('')
	const [streaming, setStreaming] = useState(false)
	const [streamBuffer, setStreamBuffer] = useState('')
	const [citations, setCitations] = useState<Citation[]>([])
	const [showThinking, setShowThinking] = useState(false)
	const [historySearch, setHistorySearch] = useState('')
	const [feedbackMap, setFeedbackMap] = useState<Record<string, 'like'|'dislike'|undefined>>({})
	const listRef = useRef<HTMLDivElement>(null)

	useEffect(() => { listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' }) }, [messages, streamBuffer])

	const filteredChats = useMemo(() => {
		if (!chats) return []
		const q = historySearch.toLowerCase()
		return chats.filter((c: any) => c.title.toLowerCase().includes(q))
	}, [chats, historySearch])

	async function send() {
		if (!input.trim() || streaming) return
		setStreaming(true)
		setStreamBuffer('')
		setCitations([])
		const res = await fetch('/api/ask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chatId, message: input })
		})
		setInput('')
		const reader = res.body!.getReader()
		const decoder = new TextDecoder()
		let buffer = ''
		while (true) {
			const { value, done } = await reader.read()
			if (done) break
			buffer += decoder.decode(value, { stream: true })
			let idx
			while ((idx = buffer.indexOf('\n\n')) !== -1) {
				const raw = buffer.slice(0, idx).trim()
				buffer = buffer.slice(idx + 2)
				if (!raw.startsWith('data:')) continue
				const json = JSON.parse(raw.slice(5).trim())
				if (json.type === 'meta') {
					setCitations(json.citations || [])
					if (!chatId) setChatId(json.chatId)
					refreshChats()
				} else if (json.type === 'token') {
					setStreamBuffer(prev => prev + json.token)
				} else if (json.type === 'thinking') {
					// handled server-side
				} else if (json.type === 'done') {
					await refreshMessages()
					setStreaming(false)
					setStreamBuffer('')
				}
			}
		}
	}

	async function newChat() {
		const resp = await fetch('/api/chats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
		const chat = await resp.json()
		setChatId(chat.id)
		refreshChats()
	}

	async function removeChat(id: string) {
		await fetch(`/api/chats?id=${id}`, { method: 'DELETE' })
		if (chatId === id) setChatId(undefined)
		refreshChats()
	}

	function copy(text: string) {
		navigator.clipboard.writeText(text)
	}

	async function feedback(messageId: string, type: 'like'|'dislike') {
		await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId, type }) })
		setFeedbackMap(m => ({ ...m, [messageId]: type }))
	}

	function shareChat() {
		if (!chatId) return
		navigator.clipboard.writeText(`${location.origin}/chat/${chatId}`)
		alert('Share link copied!')
	}

	function exportMarkdown() {
		const lines: string[] = []
		(lines as any).push(`# Chat — Curie by PhiAI\n`)
		for (const m of (messages || [])) {
			lines.push(`\n**${m.role==='user'?'You':'Curie'}**:\n\n${m.content}\n`)
		}
		const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a'); a.href=url; a.download=`chat-${chatId || 'new'}.md`; a.click(); URL.revokeObjectURL(url)
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
			<aside className="card p-4 h-[calc(100dvh-200px)] overflow-auto">
				<div className="flex items-center justify-between mb-3">
					<h3 className="font-semibold">Conversations</h3>
					<button className="btn-primary" onClick={newChat}><PlusIcon className="w-5 h-5"/>New</button>
				</div>
				<input value={historySearch} onChange={e=>setHistorySearch(e.target.value)} placeholder="Search…" className="w-full mb-3 border rounded px-3 py-2" />
				<div className="space-y-2">
					{filteredChats?.map((c: any) => (
						<div key={c.id} className={`flex items-center justify-between p-2 rounded border ${chatId===c.id? 'border-primary bg-blue-50':'border-gray-200'}`}>
							<button onClick={() => setChatId(c.id)} className="text-left flex-1 truncate pr-2">{c.title}</button>
							<button onClick={() => removeChat(c.id)} className="opacity-70 hover:opacity-100"><TrashIcon className="w-5 h-5"/></button>
						</div>
					))}
				</div>
			</aside>
			<section className="card p-0 overflow-hidden">
				<div className="p-3 border-b flex items-center gap-2">
					<button onClick={shareChat} className="btn-primary"><ShareIcon className="w-5 h-5"/>Share</button>
					<button onClick={exportMarkdown} className="btn-primary"><ClipboardIcon className="w-5 h-5"/>Export</button>
				</div>
				<div ref={listRef} className="p-6 h-[calc(100dvh-360px)] overflow-auto space-y-6">
					{messages?.map((m: Message) => (
						<div key={m.id} className="space-y-2">
							<div className={`rounded-lg p-4 ${m.role==='user'?'bg-blue-50':'bg-white border'}`}>
								<div className="flex items-center justify-between mb-2">
									<span className="font-medium">{m.role==='user'?'You':'Curie'}</span>
									<div className="flex items-center gap-2">
										{m.role!=='user' && (
											<>
												<button onClick={() => copy(m.content)} title="Copy" className="opacity-80 hover:opacity-100"><ClipboardIcon className="w-5 h-5"/></button>
												<button onClick={() => feedback(m.id,'like')} className={`opacity-80 ${feedbackMap[m.id]==='like'?'text-green-600':''}`} title="Helpful"><HandThumbUpIcon className="w-5 h-5"/></button>
												<button onClick={() => feedback(m.id,'dislike')} className={`opacity-80 ${feedbackMap[m.id]==='dislike'?'text-red-600':''}`} title="Not helpful"><HandThumbDownIcon className="w-5 h-5"/></button>
											</>
										)}
									</div>
								</div>
								<div className="text-sm leading-relaxed"><MDX content={m.content} /></div>
								{m.thinking && (
									<div className="text-xs">
										<button onClick={() => setShowThinking(s => !s)} className="underline">{showThinking? 'Hide reasoning':'Show reasoning'}</button>
										{showThinking && (
											<div className="mt-2 p-3 rounded bg-gray-50 border text-gray-700 whitespace-pre-wrap">{m.thinking}</div>
										)}
									</div>
								)}
							</div>
						</div>
					))}
					{streaming && (
						<div className="space-y-2">
							<div className="rounded-lg p-4 bg-white border">
								<div className="flex items-center justify-between mb-2">
									<span className="font-medium">Curie</span>
								</div>
								<pre className="whitespace-pre-wrap text-sm leading-relaxed">{streamBuffer || 'Thinking…'}</pre>
							</div>
						</div>
					)}
				</div>
				{citations.length>0 && (
					<div className="border-t p-4 bg-gray-50">
						<h4 className="font-semibold mb-2">Sources</h4>
						<div className="grid md:grid-cols-2 gap-3">
							{citations.map((c,i) => (
								<a key={i} href={c.url} target="_blank" className="block p-3 rounded border hover:border-primary">
									<div className="text-sm font-medium">[{i+1}] {c.title}</div>
									<div className="text-xs opacity-80 truncate">{c.url}</div>
								</a>
							))}
						</div>
					</div>
				)}
				<div className="p-4 border-t">
					<div className="flex items-center gap-3">
						<input className="flex-1 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ask Curie…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){send()}}} />
						<button onClick={send} className="btn-accent">Send</button>
						<button onClick={()=>refreshMessages()} className="btn-primary" title="Regenerate"><ArrowPathIcon className="w-5 h-5"/></button>
					</div>
					<p className="text-xs opacity-70 mt-2">Curie identifies as an AI by PhiAI. Answers are cited when web credits are available.</p>
				</div>
			</section>
		</div>
	)
}