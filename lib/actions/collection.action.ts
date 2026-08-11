"use server";

import Collection from "@/database-models/collection.model";
import { connectToDatabase } from "../mongoose";
import {
	CreateCollectionParams,
	GetAllCollections,
	SaveRecipeInCollectionParams,
} from "@/types";
import { revalidatePath } from "next/cache";
import Recipe from "@/database-models/recipe.model";

export async function createCollection(params: CreateCollectionParams) {
	try {
		connectToDatabase();
		const { clerkId, name, path } = params;
		const collectionsCount = await Collection.findOne({
			createdBy: clerkId,
		}).countDocuments();
		if (collectionsCount >= 10) {
			throw new Error(
				"You have created the maximum capacity of 10 collections. Try deleting unused collections first",
			);
		}
		await Collection.create({ createdBy: clerkId, name, default: false });
		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}

export async function getCollections(params: GetAllCollections) {
	try {
		connectToDatabase();
		const { clerkId } = params;
		const collections = await Collection.find({
			createdBy: clerkId,
		}).populate({
			path: "recipes",
			model: "Recipe",
			select: "_id title name averageRating averageCount",
		});

		if (!collections) {
			await Collection.create({
				createdBy: clerkId,
				name: "Saved",
				default: true,
			});
		}

		console.log(collections);
		return { collections };
	} catch (error) {
		throw error;
	}
}

export async function saveRecipeInCollection(
	params: SaveRecipeInCollectionParams,
) {
	try {
		connectToDatabase();
		const { clerkId, name, recipeId } = params;
		const collection = await Collection.findOne({ createdBy: clerkId, name });
		if (!collection) {
			throw new Error("No collection found");
		}

		const recipe = await Recipe.findOne({ _id: recipeId });
		if (!recipe) {
			throw new Error("No recipe with this id found");
		}
	} catch (error) {
		throw error;
	}
}
