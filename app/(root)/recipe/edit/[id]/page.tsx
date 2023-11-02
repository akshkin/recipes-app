import CreateRecipeForm from "@/components/CreateRecipeForm";
import { getRecipeById } from "@/lib/actions/recipe.action";
import { getMongoUserFromClerkId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const { userId: clerkId } = auth();

  if (!clerkId) {
    return <p>Please login to continue</p>;
  }

  const mongoUser = await getMongoUserFromClerkId(clerkId);
  const result = await getRecipeById(id);

  if (!result?.recipe) {
    return <p>Recipe not found</p>;
  }

  const {
    _id,
    title,
    description,
    category,
    cuisine,
    ingredients,
    image,
    method,
  } = result?.recipe;

  const recipe = {
    _id,
    title,
    description,
    image,
    category: category.title,
    cuisine: cuisine.title,
    ingredients,
    method,
  };

  return (
    <>
      <h1 className="text-center mb-6 h1">Edit recipe</h1>
      <CreateRecipeForm
        recipe={JSON.stringify(recipe)}
        mongoUserId={mongoUser?._id.toString()}
        type="edit"
      />
    </>
  );
}

export default Page;
