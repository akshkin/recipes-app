import RatingNumber from "@/components/RatingNumber";
import SaveAction from "@/components/SaveAction";
import { getRecipeByTitle } from "@/lib/actions/recipe.action";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { dietaryTagsConst, publicImageUrl } from "@/lib/contstants";
import RecipePdfLink from "@/components/RecipePdfLink";
import RecipeOwnerActions from "@/components/RecipeOwnerActions";
import { Suspense } from "react";
import ReviewsSection from "@/components/ReviewsSection";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import SidebarLayout from "@/components/SidebarLayout";
import { Clock3, HandPlatter } from "lucide-react";

import type { Metadata } from "next";

type Props = {
	params: Promise<{
		title: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { title } = await params;

	const result = await getRecipeByTitle({ title: decodeURIComponent(title) });

	if (!result.recipe) {
		return {
			title: "Recipe not found",
		};
	}

	const recipe = result.recipe;

	return {
		title: recipe.title,
		description: recipe.description,
		openGraph: {
			title: recipe.title,
			description: recipe.description,
			images: [
				{
					url: recipe.image,
					alt: recipe.title,
				},
			],
		},
	};
}

interface PageProps {
	params: {
		title: string;
	};
}

async function Page({ params }: PageProps) {
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
		updatedAt,
		prepTime,
		cookTime,
		servings,
		servingUnit,
		dietaryTags,
		ingredients,
		method,
		description,
		category,
		cuisine,
		averageRating,
		ratingsCount,
	} = result.recipe;

	const formattedTimeCreated = new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(createdAt));

	const formattedTimeUpdated =
		updatedAt &&
		new Intl.DateTimeFormat("en-US", {
			day: "numeric",
			month: "long",
			year: "numeric",
			timeZone: "UTC",
		})?.format(new Date(updatedAt));

	return (
		<SidebarLayout
			headerChildren={
				<>
					<Image
						src={`${publicImageUrl}/${image}`}
						alt=""
						width={500}
						height={300}
						className="w-full h-full object-cover absolute -z-10 inset-0"
					/>

					<div className="absolute inset-0 bg-black/50" />

					<div className="max-lg:pb-0  flex flex-col gap-2 justify-center w-full relative max-w-7xl mx-auto">
						<BackButton />
						<span className="bg-accent-500 rounded-xl px-2 py-1 w-fit text-xs">
							{category.title.toUpperCase()}
						</span>
						<div className="w-full flex items-start justify-between max-sm: flex-col-reverse lg:flex-col-reverse ">
							<div className="flex gap-1 items-center mb-2">
								<RatingNumber value={averageRating ?? 0} />
								{ratingsCount} ({formatNumber(ratingsCount)}{" "}
								{ratingsCount === 1 ? "rating" : "ratings"})
							</div>

							<h1 className="text-4xl font-bold lg:text-5xl max-w-xl line-clamp-2 mb-2">
								{decodedTitle}
							</h1>
						</div>

						<p className="text-xs flex gap-2 items-center">
							<Image
								src={createdBy?.image}
								alt=""
								width={24}
								height={24}
								className="rounded-full"
							/>
							<Link className="" href={`/profile/${createdBy?.clerkId}`}>
								{createdBy?.name}
							</Link>
						</p>
						{/* <p className="text-xs mt-1">
							Created: <time suppressHydrationWarning>{formattedTime}</time>
						</p> */}
						<div className="flex flex-wrap gap-2 my-">
							{prepTime && (
								<div className="flex gap-2 items-center border border-white rounded-md p-2">
									<Clock3 />
									<div>
										<p className="text-xs text-gray-200">Prep time</p>
										<p className="text-xs font-bold">{prepTime} minutes</p>
									</div>
								</div>
							)}
							{cookTime && (
								<div className="flex gap-2 items-center border border-white rounded-md p-2">
									<Clock3 />
									<div>
										<p className="text-xs text-gray-200">Cook time</p>
										<p className="text-xs font-bold">{cookTime} minutes</p>
									</div>
								</div>
							)}
							{servings && (
								<div className="flex gap-2 items-center border border-white rounded-md p-2">
									<HandPlatter />
									<div>
										<p className="text-xs text-gray-200">Servings</p>
										<p className="text-xs font-bold">
											{servings} {servingUnit}
										</p>
									</div>
								</div>
							)}
						</div>
						{dietaryTags.length > 0 ? (
							<div className="flex flex-wrap gap-2 mt-4">
								{dietaryTags?.map((tag: string) => {
									const { icon: Icon, color } = dietaryTagsConst?.[tag];
									return (
										<span
											key={tag}
											title={tag}
											className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
										>
											<Icon className="inline-block w-4 h-4 mr-1" />
											{tag}
										</span>
									);
								})}
							</div>
						) : null}
					</div>
				</>
			}
			mainChildren={
				<>
					<div className="flex flex-col lg:flex-row lg:justify-start lg:items-start gap-6">
						<section className="w-full border rounded-md border-gray-200 ">
							<h2 className="font-bold text-xl my-4 ml-3">Ingredients</h2>
							<ul className="list-none ml-0 pl-0 rounded-lg ">
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
								? "border-b border-slate-200"
								: "first-line:"
						}
		          `}
										>
											{ingredient.ingredient}
										</li>
									),
								)}
							</ul>
						</section>
						<section className="w-full border rounded-md border-gray-200 ">
							<h2 className="font-bold text-xl my-4 ml-3">Method</h2>
							<ul className="list-none ml-0 pl-0 rounded-lg">
								{method.map(
									(item: { _id: string; step: string }, index: number) => (
										<li
											className={`mx-3 py-2.5 ${index !== method.length - 1 ? "border-b border-slate-300" : ""}`}
											key={item._id}
										>
											<span className="text-accent-500 text-xl font-bold pr-2">
												{index + 1}
												{"  "}
											</span>
											{item.step}
										</li>
									),
								)}
							</ul>
						</section>
					</div>
					<Suspense
						fallback={<p className="text-center mb-8">Loading reviews...</p>}
					>
						<ReviewsSection id={_id.toString()} />
					</Suspense>
				</>
			}
			asideChildren={
				<>
					<div className="">
						<h2 className="text-2xl font-bold mb-4">About this recipe</h2>
						<p className="text-lg mt-4">{description}</p>
						<div className="mb-0 mt-4 flex flex-col gap-4">
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
							{updatedAt && (
								<p className="flex justify-between items-center">
									<span className="font-semibold">Updated </span>
									<time suppressHydrationWarning>{formattedTimeUpdated}</time>
								</p>
							)}
							<p className="flex justify-between items-center">
								<span className="font-semibold">Created </span>
								<time suppressHydrationWarning>{formattedTimeCreated}</time>
							</p>
						</div>
					</div>
					<div className="flex gap-2 flex-wrap lg:flex-col lg:w-full max-lg:items-center my-2">
						<div className="flex gap-3  lg:bg-light-800 lg:p-2 lg:flex-col max-lg:items-center lg:rounded-md">
							<h3 className="max-lg:hidden font-bold text-xl my-3">
								Liked this recipe?
							</h3>
							<SaveAction id={_id.toString()} />
							<RecipePdfLink
								recipe={JSON.stringify(result.recipe)}
								title={title}
							/>
						</div>
						<RecipeOwnerActions
							authorClerkId={createdBy?.clerkId}
							recipeId={_id.toString()}
						/>
					</div>
					<div className="flex flex-col gap-2 mt-4 max-lg:w-fit">
						<h3 className="h3">Create your own recipe</h3>
						<p className="text-left">Share you recipes with the community!</p>
						<Link href="/create-recipe" className="btn text-center">
							Create recipe
						</Link>
					</div>
				</>
			}
		/>
	);
}

export default Page;
