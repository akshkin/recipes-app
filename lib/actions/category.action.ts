"use server";

import Category from "@/database-models/category.model";
import { connectToDatabase } from "../mongoose";
import { GetRecipeByCategoryTitleParams } from "@/types";
import Recipe from "@/database-models/recipe.model";
import console from "console";

export async function getRecipesByCategory(
  params: GetRecipeByCategoryTitleParams
) {
  try {
    connectToDatabase();
    const { title, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const category = await Category.findOne({ title }).populate({
      path: "recipes",
      model: Recipe,
      options: { skip: skipAmount, limit: pageSize + 1 },
    });

    const isNextPage = category.recipes.length > pageSize;

    return { recipes: category, isNextPage };
  } catch (error) {
    console.log(error);
  }
}
