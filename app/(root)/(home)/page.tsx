import FilterAndSort from "@/components/FilterAndSort";
import Hero from "@/components/Hero";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import RecipeCard from "@/components/cards/RecipeCard";
import { getRecipes } from "@/lib/actions/recipe.action";
import Link from "next/link";

interface PageProps {
	searchParams: { [key: string]: string | undefined };
	params?: string;
}

export default async function Home({ searchParams, params }: PageProps) {
	const { page, filter, sort } = await searchParams;
	const result = await getRecipes({
		page: page ? +page : 1,
		filter: filter ? filter : "",
		sort: sort ? sort : "",
	});

	return (
		<main className="flex min-h-screen flex-col items-center pt-0 pl-0 mb-6 ">
			<Hero />
			<div className="w-[90%] max-w-[1500px]">
				<SubSection />
				<Sidebar />
				<h1 className="h1">All recipes</h1>
				<FilterAndSort filter={true} />
				<div className="custom-grid mb-8 p-8">
					{result.recipes.map((recipe) => (
						<RecipeCard
							key={recipe._id}
							_id={recipe._id}
							title={recipe.title}
							image={recipe.image}
							averageRating={recipe.averageRating}
							ratingsCount={recipe.ratingsCount}
						/>
					))}
				</div>

				{result?.isNextPage && (
					<Pagination page={page ? +page : 1} isNextPage={result.isNextPage} />
				)}
			</div>
		</main>
	);
}

function SubSection() {
	return (
		<section className="border bg-light-800 border-orange-300 rounded-md my-3 p-4">
			<h2 className="text-2xl font-semibold ">Import recipes instantly!</h2>
			<p className="text-sm mt-2 mb-4">
				Already have your recipe as PDF? Upload a recipe PDF and we will
				automatically fill the recipe for you.
			</p>
			<Link href="/create-recipe" className="btn text-sm">
				Try now
			</Link>
		</section>
	);
}
