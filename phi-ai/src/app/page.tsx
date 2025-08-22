import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
	return (
		<section className="space-y-10">
			<div className="card p-8 flex flex-col md:flex-row items-center gap-8">
				<Image src="/phi-logo.png" alt="PhiAI logo" width={100} height={100} className="rounded" />
				<div className="space-y-4">
					<h1 className="text-4xl font-bold">Curie — Research-grade AI by PhiAI</h1>
					<p className="text-lg opacity-90">
						Ask complex questions. Curie searches the web, synthesizes sources, and streams well-cited answers — fast.
					</p>
					<div className="flex gap-4">
						<Link href="/chat" className="btn-accent">Start Chatting</Link>
						<Link href="/about" className="btn-primary">Learn more</Link>
					</div>
				</div>
			</div>
			<div className="grid md:grid-cols-3 gap-6">
				<div className="card p-6">
					<h3 className="font-semibold text-lg">Cited Answers</h3>
					<p className="opacity-80">Inline citations like [1], [2] with a sources panel — inspired by Perplexity.</p>
				</div>
				<div className="card p-6">
					<h3 className="font-semibold text-lg">Streaming + Reasoning</h3>
					<p className="opacity-80">Word-by-word responses with an optional reasoning trace.</p>
				</div>
				<div className="card p-6">
					<h3 className="font-semibold text-lg">No sign-up MVP</h3>
					<p className="opacity-80">Jump straight into chat. Mobile-first, accessible, WCAG-friendly palette.</p>
				</div>
			</div>
			<div className="card p-6">
				<h2 className="text-2xl font-semibold mb-2">Support & Feedback</h2>
				<p className="opacity-80">Built in India by PhiAI. Want to support the project or fund development? Email: support@phiai.app • You can also leave feedback via our Google Form linked on the Contact page.</p>
			</div>
		</section>
	)
}