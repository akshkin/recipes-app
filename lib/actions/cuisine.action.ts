"use server";

import Cuisine from "@/database-models/cuisine.model";
import { connectToDatabase } from "../mongoose";
import { GetRecipeByCategoryTitleParams } from "@/types";

export async function getRecipesByCuisine(
  params: GetRecipeByCategoryTitleParams
) {
  try {
    connectToDatabase();
    const { title } = params;

    const recipes = await Cuisine.findOne({ title }).populate("recipes");

    return { recipes };
  } catch (error) {
    console.log(error);
  }
}
