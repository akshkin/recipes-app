import BackButton from "@/components/BackButton";
import FilterAndSort from "@/components/FilterAndSort";
import Pagination from "@/components/Pagination";
import RecipeCard from "@/components/cards/RecipeCard";
import { getRecipesByCategory } from "@/lib/actions/category.action";
import { Recipe, SearchParamsProps } from "@/types";
import Link from "next/link";

interface Props extends SearchParamsProps {
	params: {
		title: string;
	};
}

async function Page({ params, searchParams }: Props) {
	const { page, sort, diet, time } = await searchParams;
	const { title } = await params;

	const result = await getRecipesByCategory({
		title: title,
		page: page ? +page : 1,
		sort: sort ?? "",
		diet: diet ?? "",
		time: time ?? "",
	});

	return (
		<main className="flex min-h-screen flex-col p-8">
			<BackButton />
			<h1 className="h1 text-center mt-4">{title.toUpperCase()}</h1>
			{result?.totalRecipes && <FilterAndSort filter={true} />}
			{result?.recipes?.length ? (
				<>
					<div className="custom-grid my-8">
						{result?.recipes?.map((recipe: Recipe) => (
							<RecipeCard
								key={recipe._id}
								_id={recipe._id}
								image={recipe.image}
								title={recipe.title}
								averageRating={recipe.averageRating}
								ratingsCount={recipe.ratingsCount}
							/>
						))}
					</div>
					<Pagination
						page={searchParams.page ? +searchParams.page : 1}
						isNextPage={result?.isNextPage}
					/>
				</>
			) : (
				<div className="mx-auto">
					<h3 className="my-6">No recipes to show yet</h3>
					<Link href="/create-recipe" className="secondary-btn">
						Be the first to create
					</Link>
				</div>
			)}
		</main>
	);
}

export default Page;
