import React from "react";
import {
  getMongoUserFromClerkId,
  getUserById,
} from "@/lib/actions/user.action";
import { getRecipesByUserId } from "@/lib/actions/recipe.action";
import Image from "next/image";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import { auth } from "@clerk/nextjs/server";
import FilterAndSort from "@/components/FilterAndSort";
import { SearchParamsProps } from "@/types";

interface ParamsProps extends SearchParamsProps {
  params: {
    id: string;
  };
}

async function Page({ params, searchParams }: ParamsProps) {
  const { id: clerkId } = params;
  const { userId } = auth();

  if (!userId) {
    return <p className="text-center">User not found</p>;
  }

  const mongoUser = await getMongoUserFromClerkId(clerkId);

  const result = await getUserById(clerkId);
  const userRecipes = await getRecipesByUserId({
    id: mongoUser?._id,
    sort: searchParams.sort ? searchParams.sort : "",
  });

  if (!result.user) {
    <p className="text-center">User not found</p>;
  }

  const { instagram, facebook, youtube } = result?.user?.socialLinks;

  return (
    <div className="m-8 flex flex-col justify-center items-center gap-6">
      <div className="flex items-center gap-4 justify-center">
        <Image
          src={result?.user?.image}
          alt="avatar"
          width={200}
          height={200}
          className="object-cover rounded-full border-[1px] border-primary-500"
        />
        <div>
          <div className="flex gap-4 justify-between">
            <h1 className="h1">{result?.user?.name.toUpperCase()}</h1>
            {clerkId === userId && (
              <Link className="secondary-outline-btn" href="/profile/edit">
                Edit profile
              </Link>
            )}
          </div>
          <p className="text-accent-500 my-1">@{result?.user?.username}</p>
          {result.user.bio && <p>{result.user.bio}</p>}
          {result?.user?.socialLinks ? (
            <div className="flex gap-3 mt-6">
              <p>Find me here: </p>
              <div className="flex gap-4">
                {instagram && (
                  <a href={instagram} target="_blank" className="link">
                    <Image
                      src="/assets/icons/instagram.svg"
                      alt="instagram"
                      width={30}
                      height={30}
                    />
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" className="link">
                    <Image
                      src="/assets/icons/facebook.svg"
                      alt="facebook"
                      width={30}
                      height={30}
                    />
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" className="link">
                    <Image
                      src="/assets/icons/youtube.svg"
                      alt="youtube"
                      width={30}
                      height={30}
                    />
                  </a>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div>
        {userRecipes && userRecipes.length > 0 && (
          <>
            <h2 className="h2 text-center">My recipes</h2>
            <FilterAndSort filter={false} />
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
