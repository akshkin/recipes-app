export default function Loading() {
	return (
		<main className="animate-pulse">
			<div className="h-[50vh] bg-gray-200 rounded-lg mb-8" />

			<div className="space-y-4 p-8">
				<div className="h-10 w-1/2 bg-gray-200 rounded" />
				<div className="h-6 w-full bg-gray-200 rounded" />
				<div className="h-6 w-3/4 bg-gray-200 rounded" />
			</div>
		</main>
	);
}
