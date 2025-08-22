"use client"
import { useEffect, useRef } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export default function MarkdownRender({ content }: { content: string }) {
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!ref.current) return
		ref.current.querySelectorAll('pre code').forEach(block => {
			try { hljs.highlightElement(block as HTMLElement) } catch {}
		})
	}, [content])

	return (
		<div ref={ref} className="prose max-w-none">
			{content.split('\n').map((line, i) => {
				const codeMatch = line.match(/^```(.*)/)
				return <p key={i}>{line}</p>
			})}
		</div>
	)
}