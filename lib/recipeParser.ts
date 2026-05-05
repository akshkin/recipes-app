import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function parseRecipeWithLLM(recipeText: string) {
	const response = await ai.models.generateContent({
		model: "gemini-3-flash-preview",
		contents: `Extract the recipe from this text:\n\n${recipeText} and return ONLY valid JSON in this exact format:
			{
				"title": "Recipe name",
				"description": "Brief description",                
				"ingredients": [
					{ingredient: "2 cups flour"},
					{ingredient: "1 tsp salt"}
				],
				"method": [
					{step: "Step 1 instructions"},
					{step: "Step 2 instructions"}
				],
				category: "Dessert",
				cuisine: "American",
			}`,
	});
	return response.text;
}
