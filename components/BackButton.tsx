"use client";

import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function BackButton() {
	const router = useRouter();
	return (
		<button
			className="flex items-center gap-2 hover:opacity-80"
			onClick={() => router.back()}
		>
			<MoveLeft />
			Back
		</button>
	);
}

export default BackButton;
