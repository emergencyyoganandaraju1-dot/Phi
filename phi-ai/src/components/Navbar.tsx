import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
	return (
		<header className="border-b bg-white">
			<div className="container-max h-16 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					<Image src="/phi-logo.png" alt="PhiAI" width={36} height={36} />
					<span className="font-semibold text-lg">PhiAI · Curie</span>
				</Link>
				<nav className="hidden md:flex items-center gap-6">
					<Link href="/chat" className="hover:text-primary">Chat</Link>
					<Link href="/about" className="hover:text-primary">About</Link>
					<Link href="/help" className="hover:text-primary">Help</Link>
					<Link href="/contact" className="hover:text-primary">Contact</Link>
					<Link href="/admin" className="hover:text-primary">Admin</Link>
				</nav>
				<Link href="/chat" className="btn-accent">Start Chatting</Link>
			</div>
		</header>
	)
}