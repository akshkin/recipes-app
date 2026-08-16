"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { toggleSaveRecipe } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { checkIfRecipeSavedByUser } from "@/lib/actions/recipe.action";
import Link from "next/link";
import {
	checkIfRecipeInCollection,
	createCollection,
	toggleRecipeInCollection,
} from "@/lib/actions/collection.action";
import { Dialog } from "./ui/dialog";
import { Input } from "./ui/input";

interface Props {
	id: string;
}

function SaveAction({ id }: Props) {
	const [isSaved, setIsSaved] = useState(false);
	const [isSavedClicked, setIsSavedClicked] = useState(false);
	const [recipeInCollections, setRecipeInCollections] = useState([]);
	const { userId } = useAuth();
	const pathname = usePathname();

	const [wantsToCreateNewCollection, setWantsToCreateNewCollection] =
		useState(false);
	const [collectionName, setCollectionName] = useState("");

	useEffect(() => {
		if (!userId) return;
		async function checkSaved() {
			const response = await checkIfRecipeInCollection({
				clerkId: userId,
				recipeId: id,
			});
			// const isRecipeSaved = await checkIfRecipeSavedByUser(
			// 	userId?.toString()!,
			// 	id,
			// );

			console.log(response);
			setIsSaved(response?.isSaved);
			setRecipeInCollections(response?.collections);
		}

		checkSaved();
	}, [id, userId]);

	async function toggleSave(collectionId: string) {
		try {
			if (userId) {
				await toggleRecipeInCollection({
					clerkId: userId,
					collectionId,
					recipeId: id,
					path: pathname,
				});
				// await toggleSaveRecipe({ userId, recipeId: id, path: pathname });
			}
		} catch (error) {
			toast.error("Something went wrong");
		}
	}

	function handleClick() {
		// if (isSaved) {
		// 	toggleSave();
		// } else {
		console.log("clicked");
		setIsSavedClicked(true);
		// }
	}

	async function handleCreateNewCollection() {
		await createCollection({
			clerkId: userId,
			name: collectionName,
			path: pathname,
			recipeId: id,
		});
		setWantsToCreateNewCollection(false);
	}

	return (
		<>
			{userId ? (
				<Button
					className="text-accent-500 bg-white border border-accent-500 rounded-md"
					// onClick={toggleSave}
					onClick={handleClick}
				>
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
			) : (
				<Link href="/sign-in" className="btn text-center">
					Sign in to save
				</Link>
			)}
			{isSavedClicked && (
				// <div className="absolute inset-0 z-100">
				<div className="w-fit bg-slate-400 text-black">
					{recipeInCollections.map((collection) => (
						<p key={collection._id.toString()}>
							{collection?.name}
							<Button onClick={() => toggleSave(collection?._id.toString())}>
								{collection?.isInCollection ? "✅" : "+"}
							</Button>
						</p>
					))}
					<Button onClick={() => setWantsToCreateNewCollection(true)}>
						Create a new collection
					</Button>
					{wantsToCreateNewCollection && (
						<>
							<Input
								type="text"
								name="collectionName"
								value={collectionName}
								onChange={(e) => setCollectionName(e.target.value)}
							/>
							<Button onClick={handleCreateNewCollection}>Save</Button>
						</>
					)}
				</div>
				// </div>
			)}
		</>
	);
}

export default SaveAction;
