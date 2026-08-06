import FilterAndSort from "@/components/FilterAndSort";
import Hero from "@/components/Hero";
import JoinSection from "@/components/JoinSection";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import RecipeCard from "@/components/cards/RecipeCard";
import { getFeaturedRecipe, getRecipes } from "@/lib/actions/recipe.action";
import { publicImageUrl } from "@/lib/contstants";
import { FileUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
	searchParams: { [key: string]: string | undefined };
	params?: string;
}

export default async function Home({ searchParams }: PageProps) {
	const { page, filter, sort, diet, time } = await searchParams;
	const [result, featured] = await Promise.all([
		getRecipes({
			page: page ? +page : 1,
			filter: filter ?? "",
			sort: sort ?? "",
			diet: diet ?? "",
			time: time ?? "",
		}),
		getFeaturedRecipe(),
	]);

	return (
		<main className="flex min-h-screen flex-col items-center pt-0 pl-0 mb-6 ">
			<Hero />
			<div className="w-[90%] max-w-[1500px]">
				<SubSection />
				<JoinSection />
				<Sidebar />
				<FeaturedRecipe recipe={featured.recipe} />
				<section id="all-recipes">
					<h2 className="h2 mt-8">All recipes</h2>
					<FilterAndSort filter={true} />
					<div className="custom-grid mb-8">
						{result.recipes.length > 0 ? (
							result.recipes.map((recipe) => (
								<RecipeCard
									key={recipe._id}
									_id={recipe._id}
									title={recipe.title}
									image={recipe.image}
									averageRating={recipe.averageRating}
									ratingsCount={recipe.ratingsCount}
								/>
							))
						) : (
							<p>
								No recipes with applied filters. Please try with other filters
							</p>
						)}
					</div>
					{result?.isNextPage && (
						<Pagination
							page={page ? +page : 1}
							isNextPage={result.isNextPage}
						/>
					)}
				</section>
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

	return (
		<section className="mb-4" id="featured">
			<h2 className="h2 mb-3">Featured recipe</h2>
			<div className="flex gap-3 md:h-[300px] max-md:flex-col border rounded-r-md md:rounded-e-md border-gray-300 md:border-l-0">
				<Image
					src={`${publicImageUrl}/${image}`}
					alt=""
					width={400}
					height={300}
					className="w-full md:w-[50%] rounded-t-md md:rounded-s-md object-cover max-md:h-[200px]"
				/>
				<div className="md:w-[50%] p-3 md:pt-5 flex flex-col gap-1 md:gap-2">
					<span className="border border-accent-500 rounded-3xl text-accent-500 px-2 py-1 text-xs w-fit flex items-center">
						<Image
							src="/assets/icons/star.svg"
							alt={""}
							width={20}
							height={20}
							className="mr-1"
						/>
						Editor's pick
					</span>
					<h3 className="text-2xl font-semibold">{title}</h3>
					<p className="text-gray-600 text-sm lg:text-lg">{description}</p>

					<Link href={`/recipe/${title}`} className="btn w-fit text-md">
						View recipe
					</Link>
				</div>
			</div>
		</section>
	);
}
