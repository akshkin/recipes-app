import { getRecipesByUserId } from "@/lib/actions/recipe.action";
import RecipeCard from "./cards/RecipeCard";
import FilterAndSort from "./FilterAndSort";
import { GetUserRecipesParams } from "@/types";
import Pagination from "./Pagination";
import Link from "next/link";

async function AuthorRecipes({ id, page, sort }: GetUserRecipesParams) {
	const result = await getRecipesByUserId({
		id,
		page: page ? +page : 1,
		sort: sort ?? "",
	});

	if (!result) return null;

	return (
		<section id="all-recipes">
			<h2 className="h2 mt-8 text-center font-semibold">My recipes</h2>
			<FilterAndSort filter={false} />
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
					<>
						<p>You have not created any recipes yet</p>
						<Link href="/create-recipe">Start here</Link>
					</>
				)}
			</div>
			{result?.isNextPage && (
				<Pagination page={page ? +page : 1} isNextPage={result.isNextPage} />
			)}
		</section>
	);
}

export default AuthorRecipes;
