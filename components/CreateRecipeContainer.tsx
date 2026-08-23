"use client";

import { useState } from "react";
import UploadRecipe from "./UploadRecipe";
import CreateRecipeForm from "./forms/CreateRecipeForm";

function CreateRecipeContainer({ mongoUserId }: { mongoUserId: string }) {
	const [prefilledForm, setPrefilledForm] = useState<string>();
	const [isRecipeExtracting, setIsRecipeExtracting] = useState(false);

	return (
		<div className="max-w-5xl mx-auto p-4 relative">
			<UploadRecipe
				setPrefilledForm={setPrefilledForm}
				setIsRecipeExtracting={setIsRecipeExtracting}
			/>

			{isRecipeExtracting ? (
				<div className="absolute inset-0 z-10 cursor-wait opacity-40" />
			) : null}

			<CreateRecipeForm
				type="create"
				mongoUserId={mongoUserId}
				prefilledForm={prefilledForm}
			/>
		</div>
	);
}

export default CreateRecipeContainer;
