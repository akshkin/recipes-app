import FilterAndSort from "@/components/FilterAndSort";
import Pagination from "@/components/Pagination";
import RecipeCard from "@/components/cards/RecipeCard";
import { getSavedPosts } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

async function Page({ searchParams }: SearchParamsProps) {
  const { userId } = auth();

  if (!userId) {
    return <p>Please login to continue!</p>;
  }

  const filter = searchParams.filter ? searchParams.filter : "";
  const sort = searchParams.sort ? searchParams.sort : "";

  const result = await getSavedPosts({
    id: userId,
    page: searchParams.page ? +searchParams.page : 1,
    filter,
    sort,
  });

  if (!result?.savedPosts) {
    return <p>User not found</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center mt-6 p-4">
      {result?.savedPosts.length > 0 || filter || sort ? (
        <>
          <h1 className="text-center h1">Saved recipes</h1>
          <FilterAndSort filter={true} />
          <div className="custom-grid my-6 p-2">
            {result.savedPosts.length ? (
              result.savedPosts.map((recipe: any) => (
                <RecipeCard
                  key={recipe._id}
                  _id={recipe._id.toString()}
                  title={recipe.title}
                  image={recipe.image}
                  averageRating={recipe.averageRating}
                  ratingCount={recipe.ratingCount}
                />
              ))
            ) : (
              <p className="text-center">No results found</p>
            )}
          </div>

          <Pagination
            page={searchParams.page ? +searchParams.page : 1}
            isNextPage={result?.isNextPage || false}
          />
        </>
      ) : (
        <h3 className="my-6">No recipes to show yet</h3>
      )}
    </main>
  );
}

export default Page;
