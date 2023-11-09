import FilterAndSort from "@/components/FilterAndSort";
import Pagination from "@/components/Pagination";
import RecipeCard from "@/components/RecipeCard";
import { IRecipe } from "@/database-models/recipe.model";
import { getRecipesByCategory } from "@/lib/actions/category.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import React from "react";

interface Props extends SearchParamsProps {
  params: {
    title: string;
  };
}

async function Page({ params, searchParams }: Props) {
  const result = await getRecipesByCategory({
    title: params.title,
    page: searchParams.page ? +searchParams.page : 1,
    sort: searchParams.sort ? searchParams.sort : "",
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="h1 text-center mt-4">{params.title.toUpperCase()}</h1>
      {result?.recipes?.length ? (
        <>
          <FilterAndSort filter={false} />
          <div className="custom-grid my-8">
            {result?.recipes?.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                _id={recipe._id}
                image={recipe.image}
                title={recipe.title}
                averageRating={recipe.averageRating}
                ratingCount={recipe.ratingCount}
              />
            ))}
          </div>
          <Pagination
            page={searchParams.page ? +searchParams.page : 1}
            isNextPage={result?.isNextPage}
          />
        </>
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
