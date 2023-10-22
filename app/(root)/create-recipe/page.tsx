import CreateRecipeForm from "@/components/CreateRecipeForm";
import { auth } from "@clerk/nextjs";
import React from "react";

function Page() {
  const { userId } = auth();
  if (!userId) {
    return <h2>Please login to create recipe</h2>;
  }
  return <CreateRecipeForm userId={userId} />;
}

export default Page;
