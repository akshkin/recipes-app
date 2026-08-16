import AllRecipes from "@/components/AllRecipes";
import FeaturedRecipe from "@/components/FeaturedRecipe";
import Hero from "@/components/Hero";
import JoinSection from "@/components/JoinSection";
import Loading from "@/components/Loading";
import AllCuisines from "@/components/AllCuisines";
import { FileUp } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface PageProps {
	searchParams: { [key: string]: string | undefined };
	params?: string;
}

export default async function Home({ searchParams }: PageProps) {
	const { page, filter, sort, diet, time } = await searchParams;

	return (
		<main className="flex min-h-screen flex-col items-center pt-0 pl-0 mb-6 ">
			<Hero />
			<div className="w-[90%] max-w-[1500px]">
				<SubSection />
				<JoinSection />
				<AllCuisines />
				<Suspense fallback={<Loading />}>
					<FeaturedRecipe />
					<AllRecipes {...searchParams} />
				</Suspense>
			</div>
		</main>
	);
}

function SubSection() {
	return (
		<section className="border bg-light-800 border-orange-300 rounded-md my-5 p-4 flex flex-row-reverse justify-start items-center gap-4 ">
			<div className=" w-full">
				<h2 className="text-2xl font-semibold ">Import recipes instantly!</h2>
				<p className="text-sm mt-2 mb-4">
					Already have your recipe as PDF? Upload a recipe PDF and we will
					automatically fill the recipe for you.
				</p>
				<Link href="/create-recipe" className="btn text-sm">
					Try now
				</Link>
			</div>
			<FileUp size={50} className="w-24" />
		</section>
	);
}
