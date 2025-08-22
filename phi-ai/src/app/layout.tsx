import './globals.css'
import { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
	title: 'PhiAI — Curie',
	description: 'Curie by PhiAI: Research-grade AI with citations and streaming answers.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<div className="min-h-screen flex flex-col">
					<Navbar />
					<main className="flex-1 container-max py-8">{children}</main>
					<Footer />
				</div>
				<Analytics />
			</body>
		</html>
	)
}