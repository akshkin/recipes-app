"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { RecipeSchema } from "@/lib/validations";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CATEGORIES, CUISINES } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { createRecipe, editRecipe } from "@/lib/actions/recipe.action";
import { toast } from "react-toastify";
import { getPresignedUrl } from "@/lib/actions/storage";
import { publicImageUrl } from "@/lib/contstants";
import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";
import CancelButton from "../ui/CancelButton";

interface RecipeFormProps {
	mongoUserId: string;
	type: string;
	recipe?: string;
	prefilledForm?: string;
}

function CreateRecipeForm({
	mongoUserId,
	type,
	recipe,
	prefilledForm,
}: RecipeFormProps) {
	const parsedRecipe = recipe ? JSON.parse(recipe) : "";
	const [imageUrl, setImageUrl] = useState(parsedRecipe?.image || "");
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const router = useRouter();

	const form = useForm<z.infer<typeof RecipeSchema>>({
		resolver: zodResolver(RecipeSchema),
		defaultValues: parsedRecipe
			? {
					...parsedRecipe,
				}
			: {
					title: parsedRecipe ? parsedRecipe.title : "",
					description: "",
					category: "",
					cuisine: "",
					ingredients: [{ ingredient: "" }],
					method: [{ step: "" }],
				},
	});

	useEffect(() => {
		if (prefilledForm) {
			const parsed = JSON.parse(prefilledForm);
			form.reset({
				...form.getValues(),
				...parsed,
			});
		}
	}, [prefilledForm, form]);

	const {
		fields: ingredientsField,
		append: appendIngredients,
		remove: removeIngredients,
	} = useFieldArray({
		control: form.control,
		name: "ingredients",
	});

	const {
		fields: methodFields,
		append: appendMethod,
		remove: removeMethod,
	} = useFieldArray({
		control: form.control,
		name: "method",
	});

	const isEditing = type === "edit" && parsedRecipe ? true : false;

	async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files) {
			const imageFile = event?.target?.files[0];

			if (!imageFile || !event.target.files) {
				return;
			}

			//@ts-ignore next-line
			const fileExtension = imageFile?.name?.split(".").pop().toLowerCase();

			if (!fileExtension.match(/(jpg|png|jpeg)$/i)) {
				toast.error(
					"Invalid file extension. Supported extensions: jpg, jpeg, png",
				);
				return;
			}

			// Check the file size (max 5MB)
			const maxSize = 5 * 1024 * 1024; // 5MB in bytes
			if (imageFile.size > maxSize) {
				toast.error("File size exceeds the maximum limit (5MB).");
				return;
			}

			const options = {
				maxSizeMB: 1,
				maxWidthOrHeight: 1200,
				useWebWorker: true,
			};
			const compressedFile = await imageCompression(imageFile, options);

			setFile(compressedFile);
			setPreview(URL.createObjectURL(compressedFile));
		}
	}

	async function onSubmit(values: z.infer<typeof RecipeSchema>) {
		setIsLoading(true);

		const capitalizedTitle =
			values.title.charAt(0).toLocaleUpperCase() + values.title.slice(1);

		try {
			const oldImagePath = imageUrl;
			let newImagePath = imageUrl;

			//save recipe title in a uniform way
			const recipeTitle = form
				.getValues("title")
				.trim()
				.replace(/\s+/g, "-")
				.toLowerCase();
			if (file) {
				const filePath = `${mongoUserId}/${recipeTitle}/${crypto.randomUUID()}-${file.name}`;

				const response = await getPresignedUrl(filePath);

				if (response.signedUrl) {
					const uploadResponse = await fetch(response.signedUrl, {
						method: "PUT",
						headers: {
							"Content-Type": file.type,
							"Cache-Control": "public, max-age=31536000, immutable",
						},
						body: file,
					});

					if (!uploadResponse.ok) {
						toast.error("Upload failed");
					}

					if (oldImagePath) {
						// delete the image if user has already uploaed the image and tries to upload another image
						const { data, error } = await supabase.storage
							.from("recipe")
							.remove([oldImagePath]);
						setImageUrl("");
						if (error) {
							toast.error("An error occured");
						}
					}

					// set image path received from presigned url
					newImagePath = response.path;
					setImageUrl(newImagePath);
				}
			}
			if (!isEditing) {
				await createRecipe({
					...values,
					createdBy: mongoUserId,
					title: capitalizedTitle,
					image: newImagePath,
					path: pathname,
				});
			} else if (isEditing) {
				await editRecipe({
					_id: parsedRecipe._id,
					updateData: {
						...values,
						title: capitalizedTitle,
						image: newImagePath,
						createdBy: mongoUserId,
					},
					path: pathname,
				});
			}

			const messageVariable = !isEditing ? "created" : "edited";
			toast.success(`Recipe ${messageVariable} successfully`, {
				position: "top-right",
				closeOnClick: true,
				autoClose: 5000,
			});

			form.reset();

			router.replace(`/recipe/${encodeURIComponent(capitalizedTitle)}`);
		} catch (error: any) {
			toast.error(error.message, {
				position: "top-right",
				closeOnClick: true,
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="m-8 mt-0 flex flex-col items-start justify-center gap-4"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel className="h3 mt-4">
								Title <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="Title for your recipe" {...field} />
							</FormControl>

							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel className="h3 mt-4">
								Description <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="A short description" {...field} />
							</FormControl>

							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				{!isEditing && (
					<div className="flex flex-col gap-3 w-full sm:flex-row mt-4 ">
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<>
									<Select
										required
										defaultValue={""}
										value={field.value}
										onValueChange={(content) => field.onChange(content)}
									>
										<SelectTrigger className="">
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent className="bg-white">
											{CATEGORIES.map((category) => (
												<SelectItem key={category.value} value={category.value}>
													{category.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage className="text-red-500" />
								</>
							)}
						/>

						<FormField
							control={form.control}
							name="cuisine"
							render={({ field }) => (
								<>
									<Select
										required
										defaultValue={""}
										value={field.value}
										onValueChange={(content) => field.onChange(content)}
									>
										<SelectTrigger className="">
											<SelectValue placeholder="Select cuisine" />
										</SelectTrigger>
										<SelectContent className="bg-white">
											{CUISINES.map((cuisine) => (
												<SelectItem key={cuisine.value} value={cuisine.value}>
													{cuisine.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage className="text-red-500" />
								</>
							)}
						/>
					</div>
				)}

				<FormLabel className="h3 mt-4">
					Upload an Image <span className="text-red-500">*</span>
				</FormLabel>

				<Input
					name="image"
					type="file"
					accept="image/*"
					placeholder=""
					onChange={handleImageUpload}
				/>

				{preview ? (
					<Image src={preview} alt="upload" width={200} height={200} />
				) : imageUrl ? (
					<Image
						src={`${publicImageUrl}/${imageUrl}`}
						alt="upload"
						width={200}
						height={200}
					/>
				) : (
					<FormMessage className="text-red-500">Image is required</FormMessage>
				)}

				<FormLabel className="h3 mt-4">
					Ingredients <span className="text-red-500">*</span>
				</FormLabel>
				{ingredientsField.map((field, index) => (
					<FormField
						key={field.id}
						control={form.control}
						name={`ingredients.${index}.ingredient`}
						render={({ field }) => (
							<FormItem className="flex gap-3 items-baseline w-full">
								<Input {...field} placeholder="Ingredient" />
								<Button
									className="danger-btn"
									type="button"
									onClick={() => removeIngredients(index)}
								>
									Remove
								</Button>
							</FormItem>
						)}
					/>
				))}
				<Button
					className="secondary-btn"
					type="button"
					onClick={() => appendIngredients({ ingredient: "" })}
				>
					Add Ingredient
				</Button>

				<FormLabel className="h3 mt-4">
					Method <span className="text-red-500">*</span>
				</FormLabel>
				{methodFields.map((field, index) => (
					<FormField
						key={field.id}
						control={form.control}
						name={`method.${index}.step`}
						render={({ field }) => (
							<FormItem className="flex gap-3 items-baseline w-full">
								<Input {...field} placeholder="Step" />
								<Button
									className="danger-btn"
									type="button"
									onClick={() => removeMethod(index)}
								>
									Remove
								</Button>
							</FormItem>
						)}
					/>
				))}
				<Button
					className="secondary-btn"
					type="button"
					onClick={() => appendMethod({ step: "" })}
				>
					Add step
				</Button>

				<div className="flex gap-4 mt-8">
					<Button disabled={isLoading} className="btn" type="submit">
						{isLoading ? (
							<span className="flex gap-2">
								<Image
									src="/assets/icons/bubble-loading.svg"
									alt="loading"
									width={20}
									height={20}
								/>{" "}
								{!isEditing ? "Creating..." : "Saving..."}
							</span>
						) : (
							<span>{!isEditing ? "Create Recipe" : "Save Recipe"}</span>
						)}
					</Button>
					<CancelButton />
				</div>
			</form>
		</Form>
	);
}

export default CreateRecipeForm;
