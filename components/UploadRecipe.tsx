"use client";
import React, { useRef, useState } from "react";
import { parseRecipe } from "@/lib/actions/recipe.action";

function UploadRecipe({
	setPrefilledForm,
}: {
	setPrefilledForm: (data: string) => void;
}) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setError("");
		const file = e.target.files?.[0];
		if (!file || file.type !== "application/pdf") {
			setError("Please upload a PDF file");
			return;
		}

		// Add file size 2MB limit
		if (file.size > 2 * 1024 * 1024) {
			setError("File size exceeds 2MB limit. Please upload a smaller file.");
			return;
		}

		const { extractTextFromPDF } = await import("@/lib/pdfExtractor");
		try {
			setLoading(true);
			setError("");

			// Extract text from PDF
			const text = await extractTextFromPDF(file);

			// Parse with LLM
			const response = await parseRecipe(text);
			if (response) {
				setPrefilledForm(response);

				if (
					"error" in JSON.parse(response) &&
					JSON.parse(response).error === "NOT_A_RECIPE"
				) {
					setError(
						"The uploaded PDF does not appear to be a recipe. Please try uploading a cooking recipe.",
					);
				}
			}
		} catch (err) {
			console.log(err);
			setError(
				"Failed to extract recipe. Please try again after some time. Possible reasons could be that the PDF is scanned or the text is in a language other than English.",
			);
		} finally {
			setLoading(false);
			// Clear the file input value to allow re-uploading the same file if needed
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	return (
		<div className="border-2 border-dashed rounded-lg p-6 my-4">
			<label className="cursor-pointer">
				<input
					ref={fileInputRef}
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
								Click to select a PDF file (upto 2MB)
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
			<p className="text-sm text-gray-500 mt-2">
				Right now this feature only supports English recipes.
			</p>
			{error && (
				<div>
					<p className="text-red-500 text-sm mt-2">{error}</p>
					<button
						onClick={() => fileInputRef.current?.click()}
						className="mt-2 underline text-blue-600"
					>
						Try again
					</button>
				</div>
			)}
		</div>
	);
}

export default UploadRecipe;
