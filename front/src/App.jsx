const mockEvents = [
	{
		id: 1,
		title: "Winter Lights Festival",
		date: "2025-12-20",
		time: "18:00",
		city: "Vilnius",
		location: "Old Town Square",
		category: "Festival",
		summary:
			"Street performers, light installations, and hot cocoa on every corner.",
		tags: ["outdoors", "family", "holiday"],
		spotsLeft: 42,
	},
	{
		id: 2,
		title: "Tech Meetup: Future of AI",
		date: "2026-01-05",
		time: "17:30",
		city: "Kaunas",
		location: "Tech Park Conference Hall",
		category: "Meetup",
		summary:
			"Lightning talks, product demos, and networking with local founders.",
		tags: ["tech", "networking"],
		spotsLeft: 12,
	},
	{
		id: 3,
		title: "City Jazz Nights",
		date: "2026-01-12",
		time: "20:00",
		city: "Klaipėda",
		location: "Riverside Stage",
		category: "Music",
		summary:
			"Smooth jazz sets by regional artists with sunset views by the water.",
		tags: ["music", "evening"],
		spotsLeft: 8,
	},
	{
		id: 4,
		title: "Design Walk & Talk",
		date: "2026-01-18",
		time: "11:00",
		city: "Vilnius",
		location: "Modern Art District",
		category: "Tour",
		summary:
			"Guided stroll through new public art pieces and pop-up galleries.",
		tags: ["design", "art", "daytime"],
		spotsLeft: 27,
	},
];

function EventCard({ event }) {
	return (
		<article className="rounded-xl border border-slate-200/60 bg-blue/80 shadow-sm backdrop-blur hover:shadow-lg transition-shadow">
			<div className="p-4 sm:p-6 flex flex-col gap-3">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-wide text-slate-500">
							{event.category}
						</p>
						<h3 className="text-lg font-semibold text-slate-900">
							{event.title}
						</h3>
					</div>
					<span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
						{event.city}
					</span>
				</div>
				<div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
					<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
						📅 {event.date}
					</span>
					<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
						⏰ {event.time}
					</span>
					<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
						📍 {event.location}
					</span>
				</div>
				<p className="text-sm text-slate-700 leading-relaxed">
					{event.summary}
				</p>
				<div className="flex flex-wrap gap-2">
					{event.tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full bg-slate-900/5 px-2.5 py-1 text-xs font-medium text-slate-700"
						>
							#{tag}
						</span>
					))}
				</div>
				<div className="flex items-center justify-between">
					<div className="text-xs text-emerald-600 font-semibold">
						{event.spotsLeft} spots left
					</div>
					<div className="flex gap-2">
						<button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
							View details
						</button>
						<button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700">
							Save spot
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}

function App() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50">
			<div className="max-w-6xl mx-auto px-4 py-12">
				<header className="flex flex-col gap-3 mb-10">
					<h1 className="text-3xl sm:text-4xl font-bold text-white">
						Discover what’s happening
					</h1>
					<p className="text-slate-300 max-w-2xl">
						Browse the latest city happenings. This is a mock view — buttons and
						search are decorative so you can explore the layout.
					</p>
					<div className="grid gap-3 sm:grid-cols-3">
						<input
							className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
							placeholder="Search events..."
						/>
						<select className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none bg-black">
							<option>Any city</option>
							<option>Vilnius</option>
							<option>Kaunas</option>
							<option>Klaipėda</option>
						</select>
						<select className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none bg-black">
							<option>All categories</option>
							<option>Festival</option>
							<option>Meetup</option>
							<option>Music</option>
							<option>Tour</option>
						</select>
					</div>
				</header>

				<section className="grid gap-6 sm:grid-cols-2">
					{mockEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</section>
			</div>
		</div>
	);
}

export default App;
