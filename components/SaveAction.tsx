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
import { Plus } from "lucide-react";

interface Props {
	id: string;
}

type RecipeCollectionStatus = {
	_id: string;
	name: string;
	isDefault: boolean;
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
		(collection) => collection.isDefault && collection.isInCollection,
	);

	useEffect(() => {
		async function checkSaved() {
			if (!userId) {
				// toast.error("You must be signed in to create a collection");
				return;
			}
			try {
				const response = await checkIfRecipeInCollection({
					clerkId: userId,
					recipeId: id,
				});

				if (response?.collections) {
					setRecipeInCollections(response?.collections);
				}
			} catch (error) {
				toast.error("Something went wrong");
			}
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

				if (response?.collections) {
					setRecipeInCollections(response?.collections);
				}
			}
		} catch (error) {
			toast.error("Something went wrong");
		}
	}

	async function handleCreateNewCollection() {
		if (!userId) {
			// toast.error("You must be signed in to create a collection");
			return;
		}
		const response = await createCollection({
			clerkId: userId,
			name: collectionName,
			path: pathname,
			recipeId: id.toString(),
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
						className="px-2 py-2 flex justify-center hover:text-primary-700 transition-colors  text-accent-500 bg-white border border-accent-500 rounded-md"
					>
						{isSaved ? "Saved" : "Save"}
						{isSaved ? (
							<Image
								src="/assets/icons/bookmark-filled.svg"
								width={20}
								height={20}
								alt=""
								className="ml-1 sepia-0"
							/>
						) : (
							<Image
								src="/assets/icons/bookmark.svg"
								alt=""
								width={20}
								height={20}
								className="ml-1 sepia-0"
							/>
						)}
					</SheetTrigger>
					<SheetContent className="border-none mx-auto">
						<h2 className="h2 text-center font-bold">My collections</h2>
						<p className="my-2">
							Organize your favorite recipes in collections
						</p>
						<small>NOTE: You can have a maximum of 10 collections</small>
						<div className="mt-2 text-black border rounded-t-md border-gray-300 p-2">
							{recipeInCollections.map((collection) => (
								<div
									className="flex justify-between items-center"
									key={collection._id.toString()}
								>
									<p>{collection?.name}</p>
									<Button
										onClick={() => toggleSave(collection?._id.toString())}
										title={`${collection?.isInCollection ? "Remove recipe from collection" : "Add to collection"}`}
										aria-label={`${collection?.isInCollection ? "Remove recipe from collection" : "Add to collection"}`}
									>
										{collection?.isInCollection ? "✅" : <Plus />}
									</Button>
								</div>
							))}
						</div>
						<div className="border rounded-b-md border-gray-300 p-2">
							{recipeInCollections.length >= 10 ? null : (
								<Button onClick={() => setWantsToCreateNewCollection(true)}>
									<Plus /> Create a new collection
								</Button>
							)}
							{wantsToCreateNewCollection && (
								<>
									<label htmlFor="collectionName" className="block mb-2">
										Colection name
									</label>
									<Input
										type="text"
										name="collectionName"
										value={collectionName}
										placeholder="eg. Easy dinner"
										onChange={(e) => setCollectionName(e.target.value)}
									/>

									<div className="my-2 flex gap-2">
										<Button
											className="btn w-full"
											onClick={handleCreateNewCollection}
										>
											Save
										</Button>

										<Button
											onClick={() => setWantsToCreateNewCollection(false)}
											className="border border-gray-400 w-full"
										>
											Cancel
										</Button>
									</div>
								</>
							)}
						</div>
						<SheetClose asChild>
							<Button className="w-full border border-gray-400 mt-8">
								Done
							</Button>
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
