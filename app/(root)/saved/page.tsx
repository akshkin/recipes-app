import CollectionRecipes from "@/components/CollectionRecipes";
import { getCollections } from "@/lib/actions/collection.action";
import { auth } from "@clerk/nextjs/server";

async function Page() {
	const { userId } = await auth();

	if (!userId) {
		return <p>Please login to continue!</p>;
	}

	const result = await getCollections({ clerkId: userId });
	console.log(typeof result.collections);

	if (!result?.collections) {
		return <p>You haven't saved any recipes yet!</p>;
	}

	return (
		<main className="flex min-h-screen flex-col items-center mt-6 p-4">
			{result?.collections.length ? (
				<>
					<h1 className="text-center h1 mb-3">My collections</h1>
					<p>
						Here you can organize your recipes in collections to find them
						easily!
					</p>
					{result.collections.length ? (
						result.collections.map((collection) => (
							<div className="my-4">
								<h3 className="text-2xl font-bold">
									{collection.name} {collection.name === "Saved" && "(default)"}
								</h3>
								<CollectionRecipes
									key={collection._id}
									recipes={collection.recipes}
								/>
							</div>
						))
					) : (
						<p className="text-center">No results found</p>
					)}
				</>
			) : (
				<h3 className="my-6">No recipes to show yet</h3>
			)}
		</main>
	);
}

export default Page;
