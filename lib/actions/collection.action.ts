"use server";

import Collection from "@/database-models/collection.model";
import { connectToDatabase } from "../mongoose";
import {
	CheckIfRecipeInSaved,
	CreateCollectionParams,
	GetAllCollections,
	ToggleRecipeInCollectionParams,
} from "@/types";
import { revalidatePath } from "next/cache";
import Recipe from "@/database-models/recipe.model";
import User from "@/database-models/user.model";

export async function createCollection(params: CreateCollectionParams) {
	try {
		connectToDatabase();
		const { clerkId, name, path, recipeId } = params;
		const user = await User.findOne({ clerkId });
		if (!user) {
			return { message: "User not found" };
		}
		const collectionsCount = await Collection.find({
			createdBy: clerkId,
		}).countDocuments();

		if (collectionsCount >= 10) {
			throw new Error(
				"You have created the maximum capacity of 10 collections. Try deleting unused collections first",
			);
		}

		await Collection.create({
			createdBy: clerkId,
			name,
			default: false,
			recipes: recipeId ? [recipeId] : [],
		});
		const defaultCollection = await Collection.findOne({
			createdBy: clerkId,
			default: true,
		});

		if (
			defaultCollection &&
			recipeId &&
			!defaultCollection.recipes.includes(recipeId)
		) {
			defaultCollection.recipes.push(recipeId);
			await defaultCollection.save();
		}

		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}

export async function getCollections(params: GetAllCollections) {
	try {
		connectToDatabase();
		const { clerkId } = params;
		const user = await User.findOne({ clerkId });
		if (!user) {
			return { message: "User not found" };
		}

		const collections = await Collection.find({
			createdBy: clerkId,
		}).populate({
			path: "recipes",
			model: "Recipe",
			select: "_id title name averageRating averageCount",
		});

		if (!collections.length) {
			await Collection.create({
				createdBy: clerkId,
				name: "Saved",
				default: true,
			});
		}

		return { collections };
	} catch (error) {
		throw error;
	}
}

export async function getCollectionNames(params: GetAllCollections) {
	try {
		connectToDatabase();
		const { clerkId } = params;
		const user = await User.findOne({ clerkId });
		if (!user) {
			return { message: "User not found" };
		}

		const collectionNames = await Collection.find({
			createdBy: clerkId,
		}).select("_id name");

		return { collectionNames };
	} catch (error) {
		throw error;
	}
}

export async function checkIfRecipeInCollection(params: CheckIfRecipeInSaved) {
	try {
		connectToDatabase();
		const { clerkId, recipeId } = params;

		const user = await User.findOne({ clerkId });
		if (!user) {
			return { message: "User not found" };
		}

		const recipe = await Recipe.findOne({ _id: recipeId });
		if (!recipe) {
			throw new Error("No recipe with this id found");
		}

		const recipeInCollection = await Collection.find({
			createdBy: clerkId,
			recipes: recipeId,
		}).select("_id name");

		const isSaved = !!recipeInCollection.length;

		const collections = await Collection.find({
			createdBy: clerkId,
		}).select("_id name default recipes");

		return {
			isSaved,
			collections: collections.map((collection) => ({
				_id: collection._id.toString(),
				name: collection.name,
				default: collection.default,
				isInCollection: collection.recipes.some(
					(_id: string) => _id.toString() === recipeId.toString(),
				),
			})),
		};
	} catch (error) {
		throw error;
	}
}

export async function toggleRecipeInCollection(
	params: ToggleRecipeInCollectionParams,
) {
	try {
		connectToDatabase();
		const { clerkId, collectionId, recipeId, path } = params;
		const user = await User.findOne({ clerkId });
		if (!user) {
			return { message: "User not found" };
		}
		const recipe = await Recipe.findOne({ _id: recipeId });
		if (!recipe) {
			throw new Error("No recipe with this id found");
		}
		const collection = await Collection.findOne({
			createdBy: clerkId,
			_id: collectionId,
		});
		if (!collection) {
			throw new Error("No collection found");
		}

		if (collection.recipes.includes(recipeId)) {
			collection.recipes.pull(recipeId);
		} else {
			collection.recipes.push(recipeId);
		}
		await collection.save();
		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}
