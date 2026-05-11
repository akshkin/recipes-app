import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
	return (
		<main className="animate-pulse flex items-center gap-4 w-full h-full justify-center p-8">
			<Spinner className="size-8" />
		</main>
	);
}
