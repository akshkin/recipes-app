import { Recipe } from "@/types";
import RecipeCard from "./cards/RecipeCard";
import Link from "next/link";

function CollectionRecipes({ recipes }: { recipes: Recipe[] }) {
	return (
		<>
			{recipes.length ? (
				<div className="flex overflow-x-auto justify-start items-start gap-2 my-2 py-2">
					{recipes.map((recipe) => (
						<RecipeCard
							key={recipe._id}
							_id={recipe._id}
							title={recipe.title}
							image={recipe.image}
							averageRating={recipe.averageRating}
							ratingsCount={recipe.ratingsCount}
							width
						/>
					))}
				</div>
			) : (
				<>
					<p>You have not saved any recipes yet</p>
					<Link href="/#all-recipes" className="btn block mt-3 w-fit">
						Explore to save recipes
					</Link>
				</>
			)}
		</>
	);
}

export default CollectionRecipes;
