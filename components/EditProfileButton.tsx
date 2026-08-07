"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

interface Props {
	profileClerkId: string;
}

export default function EditProfileButton({ profileClerkId }: Props) {
	const { userId } = useAuth();

	if (userId !== profileClerkId) return null;

	return (
		<Link className="secondary-outline-btn" href="/profile/edit">
			Edit profile
		</Link>
	);
}
