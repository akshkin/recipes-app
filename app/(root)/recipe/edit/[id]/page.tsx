import CreateRecipeForm from "@/components/forms/CreateRecipeForm";
import { getRecipeById } from "@/lib/actions/recipe.action";
import { getMongoUserFromClerkId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

async function Page({ params }: { params: { id: string } }) {
	const { id } = await params;

	const { userId: clerkId } = await auth();

	if (!clerkId) {
		return <p>Please login to continue</p>;
	}

	const [mongoUser, result] = await Promise.all([
		getMongoUserFromClerkId(clerkId),
		getRecipeById(id),
	]);

	if (!result?.recipe) {
		return <p>Recipe not found</p>;
	}

	const {
		_id,
		title,
		description,
		prepTime,
		cookTime,
		servings,
		servingUnit,
		dietaryTags,
		category,
		cuisine,
		ingredients,
		image,
		method,
	} = result?.recipe;

	const recipe = {
		_id,
		title,
		description,
		prepTime,
		cookTime,
		servings,
		servingUnit,
		image,
		dietaryTags,
		category: category.title,
		cuisine: cuisine.title,
		ingredients,
		method,
	};

	return (
		<main className="px-4 my-4 max-w-5xl mx-auto">
			<h1 className="text-center mb-6 h1">Edit recipe</h1>
			<CreateRecipeForm
				recipe={JSON.stringify(recipe)}
				mongoUserId={mongoUser?._id.toString()}
				type="edit"
			/>
		</main>
	);
}

export default Page;
