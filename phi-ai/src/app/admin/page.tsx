"use client"
import { useState } from 'react'

export default function AdminPage() {
	const [token, setToken] = useState('')
	const [stats, setStats] = useState<any>(null)
	async function load() {
		const res = await fetch('/api/admin/stats', { headers: { 'x-admin-token': token } })
		if (!res.ok) { alert('Unauthorized'); return }
		setStats(await res.json())
	}
	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Admin Dashboard</h1>
			<div className="flex items-center gap-2">
				<input className="border rounded px-3 py-2" placeholder="Admin token" value={token} onChange={e=>setToken(e.target.value)} />
				<button onClick={load} className="btn-primary">Load</button>
			</div>
			{stats && (
				<div className="grid md:grid-cols-3 gap-4">
					<div className="card p-4"><div className="text-sm opacity-70">Chats</div><div className="text-2xl font-semibold">{stats.chats}</div></div>
					<div className="card p-4"><div className="text-sm opacity-70">Messages</div><div className="text-2xl font-semibold">{stats.messages}</div></div>
					<div className="card p-4"><div className="text-sm opacity-70">Likes</div><div className="text-2xl font-semibold">{stats.likes}</div></div>
					<div className="card p-4"><div className="text-sm opacity-70">Dislikes</div><div className="text-2xl font-semibold">{stats.dislikes}</div></div>
					<div className="card p-4"><div className="text-sm opacity-70">Events</div><div className="text-2xl font-semibold">{stats.events}</div></div>
					<div className="card p-4"><div className="text-sm opacity-70">Search credits</div><div className="text-2xl font-semibold">{stats.credits?.remaining ?? 0}</div></div>
				</div>
			)}
		</div>
	)
}