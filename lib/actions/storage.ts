"use server";

import { supabase } from "../supabase";

export async function getPresignedUrl(filePath: string) {
	const { data, error } = await supabase.storage
		.from("recipe")
		.createSignedUploadUrl(filePath);

	if (error) {
		console.error(error);
		throw new Error("Failed to upload image. Please try again after sometime");
	}

	return data;
}
