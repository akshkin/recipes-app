"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { toggleSaveRecipe } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";

interface Props {
  id: string;
  isSaved: boolean;
}

function SaveAction({ isSaved, id }: Props) {
  const { userId } = useAuth();
  const pathname = usePathname();

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
        <Button className="secondary-outline-btn" onClick={toggleSave}>
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
