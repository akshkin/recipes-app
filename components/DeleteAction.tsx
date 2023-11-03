"use client";

import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { deleteReview } from "@/lib/actions/review.action";
import { usePathname, useRouter } from "next/navigation";
import { deleteRecipe } from "@/lib/actions/recipe.action";

interface Props {
  userClerkId: string;
  type: string;
  id: string;
}

function DeleteAction({ userClerkId, type, id }: Props) {
  const { userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  async function handleDelete() {
    try {
      if (window.confirm("Are you sure you want to delete this review?")) {
        if (type === "review") {
          await deleteReview({ reviewId: id, path: pathname });
          toast.success("Review was successfully deleted");
        } else if (type === "recipe") {
          await deleteRecipe({ id, path: pathname });
          toast.success("Recipe was successfully deleted");
          router.push("/");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <>
      {userId === userClerkId && (
        <Button className="danger-btn" onClick={handleDelete}>
          Delete
          <Image
            src="/assets/icons/delete.svg"
            alt="delete"
            width={20}
            height={20}
            className="ml-1"
          />
        </Button>
      )}
    </>
  );
}

export default DeleteAction;
