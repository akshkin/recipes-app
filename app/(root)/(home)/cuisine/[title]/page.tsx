import RecipeCard from "@/components/RecipeCard";
import { IRecipe } from "@/database-models/recipe.model";
import { getRecipesByCuisine } from "@/lib/actions/cuisine.action";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    title: string;
  };
}

async function Page({ params }: Props) {
  const result = await getRecipesByCuisine({ title: params.title });

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="h1 text-center mt-4">{params.title.toUpperCase()}</h1>
      {result?.recipes?.recipes.length ? (
        <div className="custom-grid my-8">
          {result?.recipes?.recipes.map((recipe: IRecipe) => (
            <RecipeCard
              key={recipe._id}
              _id={recipe._id}
              image={recipe.image}
              title={recipe.title}
            />
          ))}
        </div>
      ) : (
        <div>
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
