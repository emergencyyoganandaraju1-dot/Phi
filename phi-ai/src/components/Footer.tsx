export default function Footer() {
	return (
		<footer className="border-t bg-white">
			<div className="container-max py-6 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
				<p className="opacity-80">© {new Date().getFullYear()} PhiAI. All rights reserved.</p>
				<p className="opacity-80">Made with ♥️ in India</p>
			</div>
		</footer>
	)
}