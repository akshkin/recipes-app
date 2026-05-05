"use client";
import React, { useState } from "react";
import UploadRecipe from "./UploadRecipe";
import CreateRecipeForm from "./forms/CreateRecipeForm";

function CreateRecipeContainer({ mongoUserId }: { mongoUserId: string }) {
	const [prefilledForm, setPrefilledForm] = useState<string>();

	return (
		<div>
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
