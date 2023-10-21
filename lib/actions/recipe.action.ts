"use server";

import Recipe from "@/database-models/recipe.model";
import { connectToDatabase } from "../mongoose";
import Category from "@/database-models/category.model";
import { revalidatePath } from "next/cache";
import Cuisine from "@/database-models/cuisine.model";
import { uploadImage } from "../firebase";
import { CreateRecipeParams } from "@/types";

// import * as admin from 'firebase-admin';

// // Initialize Firebase with Admin SDK
// const serviceAccount = require('../../recipes-app.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://your-project-id.firebaseio.com',
// });

// // Now you can use Firebase services with the Admin SDK
// const firestore = admin.firestore();
// const storage = admin.storage().bucket();

// // Example: Firestore Query
// const usersRef = firestore.collection('users');
// const user = await usersRef.doc('someUserId').get();
// console.log('User data:', user.data());

export async function createRecipe(params: CreateRecipeParams) {
  try {
    connectToDatabase();

    const {
      title,
      description,
      category,
      image,
      userId,
      cuisine,
      ingredients,
      method,
      path,
    } = params;

    console.log(params);

    const recipe = await Recipe.create({
      title,
      description,
      createdBy: userId,
      ingredients,
      method,
      image,
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

    // Now, the `recipe`, `category`, and `cuisine` models are linked appropriately.

    // const recipe = await Recipe.create({
    //   title,
    //   description,
    //   category:
    //     existingCategory?._id ||
    //     (
    //       await Category.create({ title: category })
    //     )._id,
    //   createdBy: userId,
    //   image,
    //   cuisine:
    //     existingCuisine?._id || (await Cuisine.create({ title: cuisine }))._id,
    //   ingredients,
    //   method,
    // });

    revalidatePath(path);
    // create an interaction record for the user's ask-question action
  } catch (error) {
    console.log(error);
  }
}

export async function getImageUrl(params: { image: File; userId: string }) {
  try {
    const imageUrl = await uploadImage(params.image, params.userId);
    console.log(imageUrl);
    return imageUrl;
  } catch (error) {
    console.log(error);
  }
}
