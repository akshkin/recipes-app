import RecipeCard from "@/components/RecipeCard";
import { getSavedPosts } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

async function Page() {
  const { userId } = auth();

  if (!userId) {
    return <p>Please login to continue!</p>;
  }

  const result = await getSavedPosts(userId);

  if (!result?.savedPosts) {
    return <p>User not found</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center mt-6 p-4">
      {result?.savedPosts.length > 0 ? (
        <>
          <h1 className="text-center h1">Saved recipes</h1>
          <div className="custom-grid my-6 p-2">
            {result.savedPosts.map((recipe: any) => (
              <RecipeCard
                key={recipe._id}
                _id={recipe._id.toString()}
                title={recipe.title}
                image={recipe.image}
              />
            ))}
          </div>
        </>
      ) : (
        <h3 className="my-6">No recipes to show yet</h3>
      )}
    </main>
  );
}

export default Page;
