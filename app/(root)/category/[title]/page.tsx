import RecipeCard from "@/components/RecipeCard";
import { IRecipe } from "@/database-models/recipe.model";
import { getRecipesByCategory } from "@/lib/actions/category.action";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    title: string;
  };
}

async function Page({ params }: Props) {
  const result = await getRecipesByCategory({ title: params.title });

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="h1 text-center mt-8">{params.title}</h1>
      {result?.recipes.recipes.length ? (
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
          <Link
            href="/create-recipe"
            className="link text-accent-500 underline mt-4"
          >
            Be the first to create!
          </Link>
        </div>
      )}
    </main>
  );
}

export default Page;
