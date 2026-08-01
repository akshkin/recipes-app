import RatingNumber from "@/components/RatingNumber";
import SaveAction from "@/components/SaveAction";
import { getRecipeByTitle } from "@/lib/actions/recipe.action";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { publicImageUrl } from "@/lib/contstants";
import RecipePdfLink from "@/components/RecipePdfLink";
import RecipeOwnerActions from "@/components/RecipeOwnerActions";
import { Suspense } from "react";
import ReviewsSection from "@/components/ReviewsSection";

interface Props {
	params: {
		title: string;
	};
}

async function Page({ params }: Props) {
	const { title } = await params;
	const decodedTitle = decodeURIComponent(title);

	const result = await getRecipeByTitle({ title: decodedTitle });

	if (!result.recipe) {
		return <p className="h3 text-center">Recipe not found</p>;
	}

	const {
		_id,
		image,
		createdBy,
		createdAt,
		ingredients,
		method,
		description,
		category,
		cuisine,
		averageRating,
		ratingsCount,
	} = result.recipe;

	const formattedTime = new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(createdAt));

	return (
		<main className="">
			<section
				className="flex bg-cover bg-center max-sm:flex-col  gap-4 p-6 lg:p-16 text-white relative"
				style={{
					backgroundImage: `url('${publicImageUrl}/${image}')`,
				}}
			>
				<div className="absolute inset-0 bg-black/50" />
				<div className="max-lg:pb-0 lg:pl-0 flex flex-col gap-2 justify-center w-full relative ">
					<span className="bg-accent-500 rounded-xl px-2 py-1 w-fit text-xs">
						{category.title.toUpperCase()}
					</span>
					<div className="w-full flex items-start justify-between max-sm: flex-col-reverse lg:flex-col-reverse ">
						<div className="flex gap-1 items-center mb-2">
							<RatingNumber value={averageRating ?? 0} />
							{ratingsCount} ({formatNumber(ratingsCount)}{" "}
							{ratingsCount === 1 ? "rating" : "ratings"})
						</div>

						<h1 className="text-4xl font-bold lg:text-5xl line-clamp-2 mb-2">
							{decodedTitle}
						</h1>
					</div>

					<p className="text-xs">
						By{" "}
						<Link className="" href={`/profile/${createdBy?.clerkId}`}>
							{createdBy?.name}
						</Link>
					</p>
					<p className="text-xs mt-1">
						Created: <time suppressHydrationWarning>{formattedTime}</time>
					</p>

					<div className="my-6 flex justify-start gap-2 flex-wrap items-center">
						<RecipeOwnerActions
							authorClerkId={createdBy?.clerkId}
							recipeId={_id.toString()}
						/>
						<SaveAction id={_id.toString()} />
						<RecipePdfLink
							recipe={JSON.stringify(result.recipe)}
							title={title}
						/>
					</div>
				</div>
				<div className="bg-white z-10 w-[300px] max-sm:w-full rounded-md text-gray-800 p-4">
					<h2 className="text-2xl font-bold mb-4">About this recipe</h2>
					<p className="text-lg mt-4">{description}</p>

					<div className="mb-0 mt-4 flex flex-col  gap-4">
						<p className="flex justify-between items-center">
							<span className="font-semibold">Category</span>
							<span className="text-primary-500">
								{category.title.toUpperCase()}
							</span>
						</p>

						<p className="flex justify-between items-center">
							<span className="font-semibold">Cuisine </span>
							<span className="text-primary-500">
								{cuisine.title.toUpperCase()}
							</span>
						</p>
					</div>
				</div>
			</section>

			<section className="flex flex-col lg:flex-row justify-center lg:items-start max-w-6xl gap-12 p-8 mx-auto">
				<div className="lg:w-[50%] ">
					<h3 className="font-bold text-xl my-4">Ingredients</h3>
					<ul className="list-none ml-0 pl-0 bg-primary-100 rounded-lg ">
						{ingredients.map(
							(
								ingredient: { _id: string; ingredient: string },
								index: number,
							) => (
								<li
									key={ingredient._id}
									className={`mx-3 py-2.5 
                ${
									index !== ingredients.length - 1
										? "border-b-[1px] border-slate-400"
										: "first-line:"
								}
                  `}
								>
									{ingredient.ingredient}
								</li>
							),
						)}
					</ul>
				</div>
				<div className="lg:w-[50%]">
					<h3 className="font-bold text-xl my-4">Method</h3>
					<ul className="list-none ml-0 pl-0 rounded-lg">
						{method.map(
							(item: { _id: string; step: string }, index: number) => (
								<li
									className={`px-6 py-2.5 bg-primary-100 rounded-lg my-3 `}
									key={item._id}
								>
									<span className="text-accent-500 text-xl font-bold">
										{index + 1}{" "}
									</span>
									{item.step}
								</li>
							),
						)}
					</ul>
				</div>
			</section>

			<Suspense
				fallback={<p className="text-center mb-8">Loading reviews...</p>}
			>
				<ReviewsSection id={_id.toString()} />
			</Suspense>
		</main>
	);
}

export default Page;
