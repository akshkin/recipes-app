"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	checkIfRecipeInCollection,
	createCollection,
	toggleRecipeInCollection,
} from "@/lib/actions/collection.action";
import { Input } from "./ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";

interface Props {
	id: string;
}

type RecipeCollectionStatus = {
	_id: string;
	name: string;
	default: boolean;
	isInCollection: boolean;
};

function SaveAction({ id }: Props) {
	const [recipeInCollections, setRecipeInCollections] = useState<
		RecipeCollectionStatus[]
	>([]);
	const { userId } = useAuth();

	const pathname = usePathname();

	const [wantsToCreateNewCollection, setWantsToCreateNewCollection] =
		useState(false);
	const [collectionName, setCollectionName] = useState("");

	const isSaved = recipeInCollections.some(
		(collection) => collection.default && collection.isInCollection,
	);

	useEffect(() => {
		if (!userId) return;
		async function checkSaved() {
			const response = await checkIfRecipeInCollection({
				clerkId: userId,
				recipeId: id,
			});

			setRecipeInCollections(response?.collections);
		}

		checkSaved();
	}, [id, userId]);

	async function toggleSave(collectionId: string) {
		try {
			if (userId) {
				const response = await toggleRecipeInCollection({
					clerkId: userId,
					collectionId,
					recipeId: id,
					path: pathname,
				});

				setRecipeInCollections(response?.collections);

				// setRecipeInCollections((prev) =>
				// 	prev.map((collection) => {
				// 		if (collection._id.toString() === collectionId) {
				// 			return {
				// 				...collection,
				// 				isInCollection: !collection.isInCollection,
				// 			};
				// 		} else {
				// 			return { ...collection };
				// 		}
				// 	}),
				// );

				// // Update the main Save button if the modified collection is Saved
				// const changedCollection = recipeInCollections.find(
				// 	(collection) => collection._id.toString() === collectionId,
				// );

				// if (changedCollection?.default) {
				// 	// setIsSaved(!changedCollection.isInCollection);
				// 	setRecipeInCollections([]);
				// }
			}
		} catch (error) {
			toast.error("Something went wrong");
		}
	}

	async function handleCreateNewCollection() {
		const response = await createCollection({
			clerkId: userId,
			name: collectionName,
			path: pathname,
			recipeId: id,
		});
		if (response?.collection) {
			setRecipeInCollections((prev) => [...prev, response.collection]);
		}
		setCollectionName("");
		setWantsToCreateNewCollection(false);
	}

	return (
		<>
			{userId ? (
				<Sheet>
					<SheetTrigger
						aria-label="Open saved menu"
						className="btn flex text-accent-500 bg-white border border-accent-500 rounded-md"
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
					</SheetTrigger>
					<SheetContent className="border-none mx-auto">
						<div className="w-fit  text-black">
							{recipeInCollections.map((collection) => (
								<p key={collection._id.toString()}>
									{collection?.name}
									<Button
										onClick={() => toggleSave(collection?._id.toString())}
									>
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
									<SheetClose asChild>
										<Button onClick={handleCreateNewCollection}>Save</Button>
									</SheetClose>
									<SheetClose asChild>
										<Button>Cancel</Button>
									</SheetClose>
								</>
							)}
						</div>
						<SheetClose asChild>
							<Button>Done</Button>
						</SheetClose>
					</SheetContent>
				</Sheet>
			) : (
				<Link href="/sign-in" className="btn text-center">
					Sign in to save
				</Link>
			)}
		</>
	);
}

export default SaveAction;
