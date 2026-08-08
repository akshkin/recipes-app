"use server";

import Category from "@/database-models/category.model";
import { connectToDatabase } from "../mongoose";
import { GetRecipeByCategoryTitleParams } from "@/types";
import Recipe from "@/database-models/recipe.model";
import { returnSortOptions } from "../utils";

export async function getRecipesByCategory(
	params: GetRecipeByCategoryTitleParams,
) {
	try {
		connectToDatabase();
		const { title, page = 1, pageSize = 10, sort, diet, time } = params;

		const category = await Category.findOne({ title });

		if (!category) {
			throw new Error("Category not found");
		}

		const query: Record<string, any> = {
			category: category._id,
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
			category: category._id,
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
