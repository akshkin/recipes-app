"use server";

import Recipe from "@/database-models/recipe.model";
import { connectToDatabase } from "../mongoose";
import User from "@/database-models/user.model";
import { FilterQuery } from "mongoose";

export async function searchQueries(query: string) {
  try {
    connectToDatabase();
    const regexQuery = { $regex: query, $options: "i" };

    const results = [];

    const modelAndTypes = [
      {
        model: Recipe,
        searchField: "title",
        type: "recipe",
        searchQuery: {} as FilterQuery<typeof Recipe>,
        filterQuery: [{ title: regexQuery }, { description: regexQuery }], // search across multiple fields
      },
      {
        model: User,
        searchField: "name",
        type: "user",
        searchQuery: {} as FilterQuery<typeof User>,
        filterQuery: [{ name: regexQuery }, { username: regexQuery }],
      },
    ];

    for (const {
      model,
      searchField,
      type,
      searchQuery,
      filterQuery,
    } of modelAndTypes) {
      searchQuery.$or = filterQuery;

      const queryResult = await model.find(searchQuery).limit(8);

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
