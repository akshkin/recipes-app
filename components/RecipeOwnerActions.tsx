"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import DeleteAction from "./DeleteAction";

export default function RecipeOwnerActions({
	authorClerkId,
	recipeId: _id,
}: {
	authorClerkId: string;
	recipeId: string;
}) {
	const { userId } = useAuth();

	if (userId !== authorClerkId) return null;

	return (
		<>
			<Link
				className="secondary-btn text-center lg:w-[160px]"
				href={`/recipe/edit/${_id}`}
			>
				Edit recipe
			</Link>
			<DeleteAction userClerkId={userId} id={_id.toString()} type="recipe" />
		</>
	);
}

/**
 *                               <Primitive.button.SlotClone type="button" aria-haspopup="dialog" aria-expanded={false} ...>
+                               <button
+                                 className="cursor-pointer lg:hidden link"
+                                 type="button"
+                                 aria-haspopup="dialog"
+                                 aria-expanded={false}
+                                 aria-controls="radix-_R_95knflb_"
+                                 data-state="closed"
+                                 onClick={function handleEvent}
+                                 ref={function}
+       
 * 
 */
