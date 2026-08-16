"use server";

import Cuisine from "@/database-models/cuisine.model";
import { connectToDatabase } from "../mongoose";
import { GetRecipeByCategoryTitleParams } from "@/types";
import Recipe from "@/database-models/recipe.model";
import { returnSortOptions } from "../utils";

export async function getRecipesByCuisine(
	params: GetRecipeByCategoryTitleParams,
) {
	try {
		connectToDatabase();
		const { title, page = 1, pageSize = 10, sort, diet, time } = params;

		const cuisine = await Cuisine.findOne({ title });

		if (!cuisine) {
			throw new Error("Cuisine not found");
		}

		const query: Record<string, any> = {
			cuisine: cuisine._id,
		};

		if (diet) {
			query.dietaryTags = { $all: Array.isArray(diet) ? diet : [diet] };
		}

		if (time) {
			query.$expr = {
				$lte: [{ $add: ["$prepTime", "$cookTime"] }, Number(time)],
			};
		}

		const sortOptions = sort ? returnSortOptions(sort) : {};
		const skipAmount = (page - 1) * pageSize;

		const totalRecipes = await Recipe.find({
			cuisine: cuisine._id,
		}).countDocuments();

		const recipes = await Recipe.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize + 1);

		const isNextPage = recipes.length > pageSize;

		return { recipes, isNextPage, totalRecipes };
	} catch (error) {
		console.log(error);
	}
}
