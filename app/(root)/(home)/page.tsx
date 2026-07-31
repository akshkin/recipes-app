import FilterAndSort from "@/components/FilterAndSort";
import Hero from "@/components/Hero";
import Pagination from "@/components/Pagination";
import RatingNumber from "@/components/RatingNumber";
import Sidebar from "@/components/Sidebar";
import RecipeCard from "@/components/cards/RecipeCard";
import { getRecipes } from "@/lib/actions/recipe.action";
import { publicImageUrl } from "@/lib/contstants";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
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

	const featuredRecipe = result.recipes.find(
		(recipe) =>
			recipe?.title.toLowerCase() === "healthy chocolate chip cookies",
	);

	return (
		<main className="flex min-h-screen flex-col items-center pt-0 pl-0 mb-6 ">
			<Hero />
			<div className="w-[90%] max-w-[1500px]">
				<SubSection />
				<Sidebar />
				<FeaturedRecipe recipe={featuredRecipe} />
				<h2 className="h1">All recipes</h2>
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

type Recipe = {
	recipe: {
		image: string;
		title: string;
		description: string;
		averageRating: number;
		ratingsCount: number;
	};
};

function FeaturedRecipe({ recipe }: Recipe) {
	const { image, title, description, averageRating, ratingsCount } = recipe;
	console.log(title);
	return (
		<section className="mb-4 ">
			<h2 className="h2 mb-3">Featured recipe</h2>
			<Link
				href={`/recipe/${title}`}
				className="flex gap-3 md:h-[300px] max-md:flex-col border rounded-r-md md:rounded-e-md border-gray-300 md:border-l-0"
			>
				<Image
					src={`${publicImageUrl}/${image}`}
					alt=""
					width={400}
					height={300}
					className="w-full md:w-[50%] rounded-t-md md:rounded-s-md object-cover max-md:h-[200px]"
				/>
				<div className="md:w-[50%] p-3 md:pt-5">
					<h3 className="text-3xl font-semibold mb-3">{title}</h3>
					<p className="text-gray-600 mb-3">{description}</p>
					<RatingNumber value={averageRating} />
					<span className={`text-sm text-gray-${ratingsCount ? 700 : 400}`}>
						({formatNumber(ratingsCount ?? 0)}{" "}
						{ratingsCount === 1 ? "rating" : "ratings"})
					</span>
				</div>
			</Link>
		</section>
	);
}
