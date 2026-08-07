import { getRecipes } from "@/lib/actions/recipe.action";
import type { MetadataRoute } from "next";

// Define your types based on your API or Database response
interface Recipe {
	title: string;
	updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

	// 1. Define your static routes
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: BASE_URL,
			lastModified: new Date(),
			priority: 1,
		},
	];

	// 2. Fetch data for your dynamic routes (CMS, database, external API)
	try {
		const res = await getRecipes({});
		const products: Recipe[] = res.recipes;

		// Map dynamic items into the required sitemap format
		const dynamicRoutes: MetadataRoute.Sitemap = products.map((product) => ({
			url: `${BASE_URL}/products/${product.title}`,
			lastModified: new Date(product.updatedAt),
			priority: 0.6,
		}));

		// 3. Combine and return all routes
		return [...staticRoutes, ...dynamicRoutes];
	} catch (error) {
		console.error("Failed to generate dynamic sitemap routes:", error);
		// Fallback gracefully to static routes if the API fails
		return staticRoutes;
	}
}
