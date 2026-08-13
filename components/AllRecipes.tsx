import { getFeaturedRecipe, getRecipes } from "@/lib/actions/recipe.action";
import RecipeCard from "./cards/RecipeCard";
import FilterAndSort from "./FilterAndSort";
import { GetAllRecipesParams } from "@/types";
import Pagination from "./Pagination";

async function AllRecipes({
	page,
	filter,
	sort,
	diet,
	time,
}: GetAllRecipesParams) {
	const result = await getRecipes({
		page: page ? +page : 1,
		filter: filter ?? "",
		sort: sort ?? "",
		diet: diet ?? "",
		time: time ?? "",
	});

	return (
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
					<p>No recipes with applied filters. Please try with other filters</p>
				)}
			</div>
			{result?.isNextPage && (
				<Pagination page={page ? +page : 1} isNextPage={result.isNextPage} />
			)}
		</section>
	);
}

export default AllRecipes;
