"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { toggleSaveRecipe } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { checkIfRecipeSavedByUser } from "@/lib/actions/recipe.action";

interface Props {
	id: string;
}

function SaveAction({ id }: Props) {
	const [isSaved, setIsSaved] = useState(false);
	const { userId } = useAuth();
	const pathname = usePathname();

	useEffect(() => {
		if (!userId) return;

		async function checkSaved() {
			const isRecipeSaved = await checkIfRecipeSavedByUser(
				userId?.toString()!,
				id,
			);

			setIsSaved(isRecipeSaved);
		}

		checkSaved();
	}, [id, userId]);

	async function toggleSave() {
		try {
			if (userId) {
				await toggleSaveRecipe({ userId, recipeId: id, path: pathname });
			}
		} catch (error) {
			toast.error("Something went wrong");
		}
	}

	return (
		<>
			{userId && (
				<Button className="text-accent-500 bg-white" onClick={toggleSave}>
					{isSaved ? "Saved" : "Save"}
					{isSaved ? (
						<Image
							src="/assets/icons/bookmark-filled.svg"
							width={20}
							height={20}
							alt="saved"
							className="ml-1 sepia-0"
						/>
					) : (
						<Image
							src="/assets/icons/bookmark.svg"
							alt="save"
							width={20}
							height={20}
							className="ml-1 sepia-0"
						/>
					)}
				</Button>
			)}
		</>
	);
}

export default SaveAction;
