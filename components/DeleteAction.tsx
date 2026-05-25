"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { deleteReview } from "@/lib/actions/review.action";
import { usePathname, useRouter } from "next/navigation";
import { deleteRecipe } from "@/lib/actions/recipe.action";
import Modal from "./Modal";

interface Props {
	userClerkId: string;
	type: string;
	id: string;
	recipeId?: string;
}

function DeleteAction({ userClerkId, type, id, recipeId }: Props) {
	const { userId } = useAuth();
	const pathname = usePathname();
	const router = useRouter();

	async function handleDelete() {
		try {
			if (type === "review") {
				await deleteReview({
					recipe: recipeId!,
					reviewId: id,
					path: pathname,
				});
				toast.success("Review was successfully deleted");
			} else if (type === "recipe") {
				await deleteRecipe({ id, path: pathname });
				toast.success("Recipe was successfully deleted");
				router.back();
			}
		} catch (error) {
			toast.error("Something went wrong");
		}
	}

	return (
		<>
			{userId === userClerkId && (
				<Modal
					triggerText={
						<Button className="danger-btn">
							Delete
							<Image
								src="/assets/icons/delete.svg"
								alt="delete"
								width={20}
								height={20}
								className="ml-1 grayscale-0"
							/>
						</Button>
					}
					text={type === "review" ? "this review" : "this recipe"}
					handleConfirm={handleDelete}
				/>
			)}
		</>
	);
}

export default DeleteAction;
