"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function JoinSection() {
	const { user } = useUser();

	return (
		<>
			{user ? null : (
				<section className="flex bg-primary-500 text-white rounded-md max-md:flex-col">
					<div className="flex-1 p-6">
						<h2 className="h2 font-semibold">Join our community</h2>
						<p className="mt-4 mb-2 text-gray-200">
							Do you love creating recipes but do not have your own website?
						</p>
						<p className=" mb-6 text-gray-200">
							Create an account to save recipes and share your cooking journey.
						</p>
						<Link
							href="/sign-up"
							className="bg-white text-primary-700 px-4 py-2 rounded-md"
						>
							Sign up for free
						</Link>
					</div>
					<Image
						src="/assets/join-section.jpg"
						width={400}
						height={300}
						alt="mother and daughter baking"
						className="object-fit md:rounded-r-md max-md:w-full max-md:rounded-b-md max-h-[300px] w-1/3"
					/>
				</section>
			)}
		</>
	);
}

export default JoinSection;
