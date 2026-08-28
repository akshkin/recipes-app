"use server";

import Recipe from "@/database-models/recipe.model";
import { connectToDatabase } from "../mongoose";
import Category from "@/database-models/category.model";
import { revalidatePath } from "next/cache";
import Cuisine from "@/database-models/cuisine.model";
import {
	CreateRecipeParams,
	DeleteRecipeParams,
	EditRecipeParams,
	GetAllRecipesParams,
	GetRecipeByTitleParams,
	GetUserRecipesParams,
} from "@/types";
import User from "@/database-models/user.model";
import { returnSortOptions } from "../utils";
import Review from "@/database-models/review.model";
import { parseRecipeWithLLM } from "../recipeParser";
import mongoose from "mongoose";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function createRecipe(params: CreateRecipeParams) {
	try {
		connectToDatabase();

		const {
			title,
			description,
			category,
			image,
			createdBy,
			cuisine,
			ingredients,
			method,
			path,
			prepTime,
			cookTime,
			servings,
			servingUnit,
		} = params;

		const existingRecipeTitle = await Recipe.findOne({ title });

		if (existingRecipeTitle) {
			throw new Error(
				`Recipe title already exists. Please provide another recipe title`,
			);
		}

		const recipe = await Recipe.create({
			title,
			description,
			createdBy,
			ingredients,
			method,
			image,
			prepTime,
			cookTime,
			servings,
			servingUnit,
		});

		await recipe.save();

		const [existingCategory, existingCuisine] = await Promise.all([
			Category.findOne({ title: category }),
			Cuisine.findOne({ title: cuisine }),
		]);

		let newCategory;
		let newCuisine;

		if (!existingCategory) {
			newCategory = new Category({
				title: category,
				recipes: [recipe._id], // Add the new recipe's ID to the category's recipes array.
			});
			await newCategory.save();
		} else {
			existingCategory.recipes.push(recipe._id); // Add the new recipe's ID to the existing category's recipes array.
			await existingCategory.save();
		}

		if (!existingCuisine) {
			newCuisine = new Cuisine({
				title: cuisine,
				recipes: [recipe._id], // Add the new recipe's ID to the cuisine's recipes array.
			});
			await newCuisine.save();
		} else {
			existingCuisine.recipes.push(recipe._id); // Add the new recipe's ID to the existing cuisine's recipes array.
			await existingCuisine.save();
		}

		await Recipe.findByIdAndUpdate(recipe._id, {
			category: existingCategory?._id || newCategory._id,
			cuisine: existingCuisine?._id || newCuisine._id,
		});

		revalidatePath(path);
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}
		throw error;
	}
}

export async function getRecipes(params: GetAllRecipesParams) {
	try {
		connectToDatabase();
		const { page = 1, pageSize = 20, filter, sort, diet, time } = params;

		const query: Record<string, any> = {};

		let category;

		if (filter) {
			category = await Category.findOne({ title: filter });
			query.category = category._id;
		}

		let sortOptions = {};

		if (sort) {
			sortOptions = returnSortOptions(sort);
		}

		if (diet) {
			query.dietaryTags = { $all: Array.isArray(diet) ? diet : [diet] };
		}

		if (time) {
			query.$expr = {
				$lte: [{ $add: ["$prepTime", "$cookTime"] }, Number(time)],
			};
		}

		const skipAmount = (page - 1) * pageSize;

		const recipes = await Recipe.find(query)
			.limit(pageSize)
			.skip(skipAmount)
			.sort(sortOptions);

		const totalRecipes = await Recipe.countDocuments(query);

		const isNextPage = totalRecipes > skipAmount + recipes.length;

		return { recipes: recipes, isNextPage };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getRecipeByTitle(params: GetRecipeByTitleParams) {
	try {
		connectToDatabase();
		const { title } = params;

		const recipe = await Recipe.findOne({ title })
			.populate({
				path: "createdBy",
				model: User,
				select: "name clerkId image",
			})
			.populate({ path: "category", model: "Category", select: "title" })
			.populate({ path: "cuisine", model: "Cuisine", select: "title" });

		if (!recipe) {
			return { error: "Recipe not found" };
		}

		return { recipe };
	} catch (error) {
		throw error;
	}
}

export async function getRecipesByUserId(params: GetUserRecipesParams) {
	try {
		connectToDatabase();
		const { page = 1, pageSize = 20, id, sort } = params;

		let sortOptions;

		if (sort) {
			sortOptions = returnSortOptions(sort);
		}

		const skipAmount = (page - 1) * pageSize;

		const recipes = await Recipe.find({ createdBy: id })
			.limit(pageSize)
			.skip(skipAmount)
			.sort(sortOptions);

		const totalRecipes = await Recipe.countDocuments({ createdBy: id });

		const isNextPage = totalRecipes > skipAmount + recipes.length;

		return { recipes, isNextPage };
	} catch (error) {
		console.log(error);
	}
}

export async function getRecipeById(id: string) {
	try {
		connectToDatabase();
		const recipe = await Recipe.findById(id)
			.populate({ path: "category", model: "Category", select: "title" })
			.populate({ path: "cuisine", model: "Cuisine", select: "title" });

		if (!recipe) {
			return { message: "Recipe not found" };
		}
		return { recipe };
	} catch (error) {
		console.log(error);
	}
}

export async function editRecipe(params: EditRecipeParams) {
	try {
		connectToDatabase();
		const { _id, updateData, path } = params;

		const [existingCategory, existingCuisine] = await Promise.all([
			Category.findOne({ title: updateData.category }),
			Cuisine.findOne({ title: updateData.cuisine }),
		]);

		const existingTitle = await Recipe.findOne({
			_id: { $ne: _id },
			title: updateData.title,
		});

		if (existingTitle) {
			throw new Error(
				"Recipe title already exists. Please choose another title.",
			);
		}

		const recipe = await Recipe.findByIdAndUpdate(
			_id,
			{
				...updateData,
				category: existingCategory._id,
				cuisine: existingCuisine._id,
			},
			{ new: true },
		);

		revalidatePath(path);
	} catch (error: any) {
		if (isRedirectError(error)) {
			throw error;
		}
		console.log(error.message);
		throw error;
	}
}

export async function deleteRecipe(params: DeleteRecipeParams) {
	try {
		connectToDatabase();
		const { id, path } = params;

		const recipe = await Recipe.findByIdAndDelete(id);

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function parseRecipe(recipeText: string) {
	try {
		const response = await parseRecipeWithLLM(recipeText);
		return response;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function checkIfRecipeSavedByUser(
	userId: string,
	recipeId: string,
) {
	try {
		connectToDatabase();
		const user = await User.findOne({ clerkId: userId });
		return user?.saved.includes(recipeId) || false;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function updateRecipeRating(recipeId: string) {
	const stats = await Review.aggregate([
		{
			$match: {
				recipe: new mongoose.Types.ObjectId(recipeId),
			},
		},
		{
			$group: {
				_id: "$recipe",
				averageRating: { $avg: "$rating" },
				ratingsCount: { $sum: 1 },
			},
		},
	]);

	await Recipe.findByIdAndUpdate(
		recipeId,
		{
			$set: {
				averageRating: Math.round((stats[0]?.averageRating || 0) * 10) / 10,
				ratingsCount: stats[0]?.ratingsCount || 0,
			},
		},
		{ new: true, strict: true },
	);
}

export async function getFeaturedRecipe() {
	try {
		connectToDatabase();
		const title = "Healthy Chocolate Chip Cookies";
		const recipe = await Recipe.findOne({ title });

		return { recipe };
	} catch (error) {
		console.error(error);
		throw error;
	}
}
