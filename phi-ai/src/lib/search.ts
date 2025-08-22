import ky from 'ky'
import * as cheerio from 'cheerio'
import { prisma } from './prisma'

const TAVILY_KEY = process.env.TAVILY_API_KEY
const DAILY_LIMIT = Number(process.env.DAILY_SEARCH_CREDIT_LIMIT || 200)

export type WebDoc = { title: string; url: string; snippet: string }

export async function ensureCredits(): Promise<number> {
	const today = new Date()
	today.setHours(0,0,0,0)
	let record = await prisma.credits.findFirst({ where: {} })
	if (!record) {
		record = await prisma.credits.create({ data: { remaining: DAILY_LIMIT } })
	}
	// reset if date changed
	if (record.date < today) {
		record = await prisma.credits.update({ where: { id: record.id }, data: { date: new Date(), remaining: DAILY_LIMIT } })
	}
	return record.remaining
}

export async function decrementCredits(n = 1) {
	const c = await prisma.credits.findFirst({})
	if (!c) return
	await prisma.credits.update({ where: { id: c.id }, data: { remaining: Math.max(0, c.remaining - n) } })
}

export async function tavilySearch(query: string): Promise<WebDoc[]> {
	if (!TAVILY_KEY) return []
	const credits = await ensureCredits()
	if (credits <= 0) return []
	const resp: any = await ky.post('https://api.tavily.com/search', {
		json: { query, include_answer: false, max_results: 6 },
		headers: { 'Content-Type': 'application/json', 'X-Tavily-API-Key': TAVILY_KEY }
	}).json()
	await decrementCredits(1)
	const results = (resp?.results || []).map((r: any) => ({ title: r.title, url: r.url, snippet: r.snippet })) as WebDoc[]
	return results
}

export async function fetchPageSnippet(url: string): Promise<string> {
	try {
		const html = await ky.get(url, { timeout: 15000 }).text()
		const $ = cheerio.load(html)
		$('script,style,noscript').remove()
		const text = $('body').text().replace(/\s+/g, ' ').trim()
		return text.slice(0, 2000)
	} catch {
		return ''
	}
}

export async function buildContext(query: string): Promise<{ context: string; docs: WebDoc[] }> {
	const docs = await tavilySearch(query)
	const enriched: WebDoc[] = []
	let context = ''
	for (const doc of docs) {
		const snippet = await fetchPageSnippet(doc.url)
		const snip = snippet || doc.snippet
		if (!snip) continue
		enriched.push({ ...doc, snippet: snip })
		context += `\n[${enriched.length}] ${doc.title} — ${doc.url}\n${snip}\n`
	}
	return { context: context.trim(), docs: enriched }
}