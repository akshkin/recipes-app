"use server";

import Recipe from "@/database-models/recipe.model";
import { connectToDatabase } from "../mongoose";
import User from "@/database-models/user.model";

export async function searchQueries(query: string) {
  try {
    connectToDatabase();
    const regexQuery = { $regex: query, $options: "i" };

    console.log(query);
    const results = [];
    const modelAndTypes = [
      {
        model: Recipe,
        searchField: "title",
        type: "recipe",
      },
      {
        model: User,
        searchField: "name",
        type: "user",
      },
    ];

    for (const { model, searchField, type } of modelAndTypes) {
      const queryResult = await model
        .find({ [searchField]: regexQuery })
        .limit(5);

      results.push(
        ...queryResult.map((item) => ({
          title: item[searchField],
          type,
          id: type === "user" ? item.clerkId : item.title,
        }))
      );
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
