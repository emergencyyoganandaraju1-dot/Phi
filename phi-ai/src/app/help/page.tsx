export default function HelpPage() {
	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Help & FAQ</h1>
			<ul className="list-disc pl-6 space-y-2">
				<li>Type a question and press Enter. Curie will search and stream an answer.</li>
				<li>Use the like/dislike to provide feedback. Click Sources to open references.</li>
				<li>No voice or file uploads in this MVP.</li>
			</ul>
		</div>
	)
}