import { getMongoUserFromClerkId } from "@/lib/actions/user.action";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

async function Hero() {
	const { userId } = await auth();
	let mongoUser;

	if (userId) {
		mongoUser = await getMongoUserFromClerkId(userId);
	}

	return (
		<div className="flex flex-col items-start justify-center bg-light-800 rounded-lg pl-6 pr-6 w-full max-md:h-[35vh] max-sm:py-3">
			<h1 className="h1 mb-4">
				{userId && (
					<span>
						Welcome,{" "}
						<span className="text-accent-500">{mongoUser?.name}!</span>{" "}
					</span>
				)}
			</h1>
			<p className="mb-4">
				Do you love creating recipes and sharing with the world? We now have a
				feature where you can upload a PDF of your recipe and we will auto-fill
				the form for you! No more copy-pasting, just upload and create your
				recipe in minutes!
			</p>
			<SignedIn>
				<Link href="/create-recipe" className="btn">
					Create recipe
				</Link>
			</SignedIn>
			<SignedOut>
				<Link className="secondary-btn" href="/sign-up">
					Join us now
				</Link>
			</SignedOut>
		</div>
	);
}

export default Hero;
