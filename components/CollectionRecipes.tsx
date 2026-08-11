import { Recipe } from "@/types";
import RecipeCard from "./cards/RecipeCard";
import Link from "next/link";

function CollectionRecipes({ recipes }: { recipes: Recipe[] }) {
	return (
		<>
			{recipes.length ? (
				recipes.map((recipe) => (
					<div className="flex overflow-x-scroll">
						<RecipeCard {...recipe} />
					</div>
				))
			) : (
				<>
					<p>You have not saved any recipes yet</p>
					<Link href="/#all-recipes" className="btn block mt-3">
						Explore to save recipes
					</Link>
				</>
			)}
		</>
	);
}

export default CollectionRecipes;
