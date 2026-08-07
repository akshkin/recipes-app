"use client";

import { useUser } from "@clerk/nextjs";

export default function WelcomeUser() {
	const { user } = useUser();

	return (
		<h1 className="h1 mb-4">
			Welcome
			{user && (
				<span className="text-accent-500">
					<span className="text-black">,</span> {user.firstName}
				</span>
			)}
			!
		</h1>
	);
}
