import CreateRecipeForm from "@/components/CreateRecipeForm";
import { getMongoUserFromClerkId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

async function Page() {
  const { userId } = auth();
  if (!userId) {
    return <h2>Please login to create recipe</h2>;
  }

  const mongoUser = await getMongoUserFromClerkId(userId);

  return (
    <>
      <h1 className="text-center mb-10 h1">Create recipe</h1>
      <CreateRecipeForm type="create" mongoUserId={mongoUser._id.toString()} />
    </>
  );
}

export default Page;
