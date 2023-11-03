"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { RecipeSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormDescription,
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
import { deleteImage, uploadImage } from "@/lib/firebase";
import Image from "next/image";
import { CATEGORIES, CUISINES } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { createRecipe, editRecipe } from "@/lib/actions/recipe.action";
import { toast } from "react-toastify";

interface RecipeFormProps {
  mongoUserId: string;
  type: string;
  recipe?: string;
}

function CreateRecipeForm({ mongoUserId, type, recipe }: RecipeFormProps) {
  const parsedRecipe = recipe ? JSON.parse(recipe) : "";
  const [imageUrl, setImageUrl] = useState(parsedRecipe.image || "");
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
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

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event?.target?.files[0];

      if (!file || !event.target.files) {
        return;
      }

      //@ts-ignore next-line
      const fileExtension = file?.name?.split(".").pop().toLowerCase();

      if (!fileExtension.match(/(jpg|png|jpeg)$/i)) {
        toast.error(
          "Invalid file extension. Supported extensions: jpg, jpeg, png"
        );
        return;
      }

      // Check the file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        toast.error("File size exceeds the maximum limit (2MB).");
        return;
      }
      try {
        const response = await uploadImage(file, mongoUserId);
        // delete the image if user has already uploaed the image and tries to upload another image
        if (imageUrl) {
          await deleteImage(imageUrl);
        }
        setImageUrl(response);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  }

  async function onSubmit(values: z.infer<typeof RecipeSchema>) {
    setIsLoading(true);
    try {
      if (type === "create") {
        await createRecipe({
          ...values,
          createdBy: mongoUserId,
          image: imageUrl,
          path: pathname,
        });
      } else if (type === "edit") {
        await editRecipe({
          _id: parsedRecipe._id,
          updateData: {
            ...values,
            image: imageUrl,
            createdBy: mongoUserId,
          },
          path: pathname,
        });
      }

      const messageVariable = type === "create" ? "created" : "edited";
      toast.success(`Recipe ${messageVariable} successfully`, {
        position: "top-right",
        closeOnClick: true,
        autoClose: 5000,
      });

      form.reset();

      router.push("/");
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
        {type === "create" && (
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

        {imageUrl ? (
          <Image src={imageUrl} alt="upload" width={200} height={200} />
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

        <Button disabled={isLoading} className="btn mt-8" type="submit">
          {isLoading ? (
            <span className="flex gap-2">
              <Image
                src="/assets/icons/bubble-loading.svg"
                alt="loading"
                width={20}
                height={20}
              />{" "}
              Submitting
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default CreateRecipeForm;
