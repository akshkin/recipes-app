"use client";
import React, { useState } from "react";
import { extractTextFromPDF } from "@/lib/pdfExtractor";
import { parseRecipe } from "@/lib/actions/recipe.action";

// const data = {
// 	title: "Healthy Chocolate Chip Cookies",
// 	description:
// 		"The best healthy chocolate chip cookies recipe that yields delicious soft and chewy cookies!",
// 	ingredients: [
// 		{ ingredient: "1 cup oat flour" },
// 		{ ingredient: "1/2 tsp baking soda" },
// 		{ ingredient: "1/4 tsp salt" },
// 		{ ingredient: "4 tbsp coconut sugar or brown sugar" },
// 		{
// 			ingredient: "4 tbsp white sugar or additional coconut sugar",
// 		},
// 		{ ingredient: "1/3 cup chocolate chips or more if desired" },
// 		{ ingredient: "1/3 cup chopped nuts (optional)" },
// 		{ ingredient: "1 tsp pure vanilla extract" },
// 		{ ingredient: "2 tbsp vegetable or melted coconut oil" },
// 		{ ingredient: "3-5 tbsp milk of choice, as needed" },
// 	],
// 	method: [
// 		{ step: "Preheat oven to 380 degrees." },
// 		{ step: "Combine dry ingredients and mix very well." },
// 		{ step: "Add wet ingredients and form into a big ball." },
// 		{ step: "Form little balls from the big ball of dough." },
// 		{
// 			step: "For soft cookies, refrigerate until cold; otherwise, bake right away.",
// 		},
// 		{ step: "Bake for 9 minutes." },
// 		{ step: "Form little balls from the big ball of dough." },
// 		{
// 			step: "For soft cookies, refrigerate until cold; otherwise, bake right away.",
// 		},
// 		{ step: "Bake for 9 minutes." },
// 		{ step: "Bake for 9 minutes." },
// 		{
// 			step: "Remove from oven when they’re still a little undercooked and let cool for 10 minutes on the tray, as they will con",
// 		},
// 		{
// 			step: "Remove from oven when they’re still a little undercooked and let cool for 10 minutes on the tray, as they will continue to cook while cooling.",
// 		},
// 		{
// 			step: "If the cookies have not spread out, smush them down with a spoon.",
// 		},
// 		{
// 			step: "Store in a lidded plastic container for softer cookies or a lidded glass container for crispier cookies.",
// 		},
// 	],
// 	category: "Dessert",
// 	cuisine: "American",
// };

function UploadRecipe({
	setPrefilledForm,
}: {
	setPrefilledForm: (data: string) => void;
}) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || file.type !== "application/pdf") {
			setError("Please upload a PDF file");
			return;
		}

		try {
			setLoading(true);
			setError("");

			// Extract text from PDF
			const text = await extractTextFromPDF(file);

			// Parse with LLM
			const response = await parseRecipe(text);
			if (response) {
				setPrefilledForm(response);
			}
		} catch (err) {
			setError("Failed to extract recipe. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="border-2 border-dashed rounded-lg p-6 mx-8 my-4">
			<label className="cursor-pointer">
				<input
					type="file"
					accept="application/pdf"
					onChange={handleFileUpload}
					className="hidden"
					disabled={loading}
				/>
				<div className="text-center">
					{loading ? (
						<p>Extracting recipe...</p>
					) : (
						<>
							<p className="text-lg font-medium">
								<span className="text-green-500">NEW!</span> Upload PDF Recipe
								to autofill the form
							</p>
							<p className="text-sm text-gray-500">
								Click to select a PDF file
							</p>
						</>
					)}
				</div>
			</label>
			<p className="text-sm text-gray-500 mt-2">
				NOTE: Please note that this feature can have limitations in parsing
				complex PDFs and the extracted text can be inaccurate. Make sure to
				review the pre-filled form for any necessary corrections after
				uploading. You would still have to fill in the category and cuisine
				fields as those are not usually populated automatically and the image
				would have to be manually uploaded.
			</p>
			{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
		</div>
	);
}

export default UploadRecipe;
