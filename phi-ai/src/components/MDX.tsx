"use client"
import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export default function MDX({ content }: { content: string }) {
	useEffect(() => {
		document.querySelectorAll('pre code').forEach((el) => {
			try { hljs.highlightElement(el as HTMLElement) } catch {}
		})
	}, [content])
	return (
		<div className="prose max-w-none">
			<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw as any, rehypeKatex as any]}>
				{content}
			</ReactMarkdown>
		</div>
	)
}