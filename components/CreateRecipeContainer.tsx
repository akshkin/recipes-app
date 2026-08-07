"use client";
import React, { useState } from "react";
import UploadRecipe from "./UploadRecipe";
import CreateRecipeForm from "./forms/CreateRecipeForm";

function CreateRecipeContainer({ mongoUserId }: { mongoUserId: string }) {
	const [prefilledForm, setPrefilledForm] = useState<string>();

	return (
		<div className="max-w-5xl mx-auto p-4">
			<UploadRecipe setPrefilledForm={setPrefilledForm} />
			<CreateRecipeForm
				type="create"
				mongoUserId={mongoUserId}
				prefilledForm={prefilledForm}
			/>
		</div>
	);
}

export default CreateRecipeContainer;
