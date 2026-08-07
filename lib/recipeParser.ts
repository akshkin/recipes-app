import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function parseRecipeWithLLM(recipeText: string) {
	console.log("jfvbirbvr;o");
	const response = await ai.models.generateContent({
		model: "gemini-3-flash-preview",
		contents: `
			Determine if the following text is a cooking recipe.

			If it is NOT a recipe, return EXACTLY:
			{"error":"NOT_A_RECIPE"}

			If it IS a recipe, extract the data and return ONLY valid JSON in this exact format (no extra text, no markdown):

			{
			"title": "Recipe name",
			"description": "Brief description",
			"prepTime": 30,
			"cookTime": 45,
			"servings": 4,
			"servingUnit": "people",
			"dietaryTags": ["Vegetarian", "Gluten-Free"],
			"ingredients": [
				{ "ingredient": "2 cups flour" },
				{ "ingredient": "1 tsp salt" }
			],
			"method": [
				{ "step": "Step 1 instructions" },
				{ "step": "Step 2 instructions" }
			],
			"category": "Dessert",
			"cuisine": "American"
			}

			Notes:
			- The input may use headings like "method", "instructions", "directions", or "preparation" — map all of them to "method".
			- If any field is missing, return an empty string or empty array.
			- Do NOT include any text outside the JSON.

			Text:
			${recipeText}
		`,
	});
	return response.text;
}
