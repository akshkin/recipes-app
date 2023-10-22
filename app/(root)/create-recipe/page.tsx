import CreateRecipeForm from "@/components/CreateRecipeForm";
import { auth } from "@clerk/nextjs";
import React from "react";

function Page() {
  const { userId } = auth();
  if (!userId) {
    return <h2>Please login to create recipe</h2>;
  }
  return (
    <>
      <h1 className="text-center mb-10 h1">Create recipe</h1>
      <CreateRecipeForm userId={userId} />
    </>
  );
}

export default Page;
