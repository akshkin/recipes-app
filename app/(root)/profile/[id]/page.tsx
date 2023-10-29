import { getUserById } from "@/lib/actions/user.action";
import { getRecipesByUserId } from "@/lib/actions/recipe.action";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import { auth } from "@clerk/nextjs/server";

interface ParamsProps {
  params: {
    id: string;
  };
}

async function Page({ params }: ParamsProps) {
  const { id: clerkId } = params;
  const { userId } = auth();

  const result = await getUserById(clerkId);
  const userRecipes = await getRecipesByUserId(clerkId);

  if (!result.user) {
    return <p className="text-center">User not found!</p>;
  }

  return (
    <div className="m-8 flex flex-col justify-center items-center gap-4">
      <div className="flex items-center gap-4 justify-center">
        <Image
          src={result?.user?.image}
          alt="avatar"
          width={200}
          height={200}
          className="object-cover rounded-full border-[1px] border-primary-500"
        />
        <div>
          <div className="flex justify-between">
            <h1 className="h1">{result?.user?.name.toUpperCase()}</h1>
            {clerkId === userId && (
              <Link className="secondary-outline-btn" href="/edit/profile">
                Edit profile
              </Link>
            )}
          </div>
          <p className="text-accent-500 my-1">@{result?.user?.username}</p>
          {result.user.bio && <p>{result.user.bio}</p>}
        </div>
      </div>
      {result?.user?.socialLinks?.length ? (
        <>
          <p>Find me here</p>
          {result?.user?.socialLinks?.map((link: any) => (
            <Link key={link._id} href={link}>
              {link}
            </Link>
          ))}
        </>
      ) : null}
      <div>
        {userRecipes?.length && (
          <>
            <h2 className="h2 text-center">My recipes</h2>
            <div className="custom-grid mt-6">
              {userRecipes?.map((recipe: any) => (
                <RecipeCard
                  key={recipe._id}
                  _id={recipe._id}
                  title={recipe.title}
                  image={recipe.image}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
