"use server";

import Category from "@/database-models/category.model";
import { connectToDatabase } from "../mongoose";
import { GetRecipeByCategoryTitleParams } from "@/types";

export async function getRecipesByCategory(
  params: GetRecipeByCategoryTitleParams
) {
  try {
    connectToDatabase();
    const { title } = params;

    const recipes = await Category.findOne({ title }).populate("recipes");

    return { recipes };
  } catch (error) {
    console.log(error);
  }
}
