import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import WelcomeUser from "./WelcomeUser";

async function Hero() {
	return (
		<div className="flex flex-col items-start justify-center bg-light-800 rounded-lg p-6 w-full max-md:h-[35vh] max-sm:py-3 mx-auto">
			<WelcomeUser />

			<p className="mb-4 text-lg">
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
