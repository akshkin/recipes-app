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
import { usePathname } from "next/navigation";
import { createRecipe } from "@/lib/actions/recipe.action";

function CreateRecipeForm({ userId }: { userId: string }) {
  const [imageUrl, setImageUrl] = useState<File>();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof RecipeSchema>>({
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      title: "",
      description: "",
      image:
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvb2R8ZW58MHx8MHx8fDA%3D",
      category: "",
      cuisine: "",
      userId: userId,
      ingredients: [{ ingredient: "" }],
      method: [{ step: "" }],
    },
  });

  const errors = form.formState.errors;

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
      setImageUrl(file);
    }
  }

  async function onSubmit(values: z.infer<typeof RecipeSchema>) {
    /* TODO: handle image upload **/
    setIsLoading(true);
    try {
      await createRecipe({ ...values, path: pathname });
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
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
        <div className="flex flex-col gap-3 w-full sm:flex-row mt-4 ">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <>
                <Select
                  required
                  defaultValue={field.value}
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
                  defaultValue={field.value}
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

        {/* <FormLabel className="h3 mt-4">
          Upload an Image <span className="text-red-500">*</span>
        </FormLabel>
        <Input
          name="image"
          type="file"
          accept="image/*"
          placeholder=""
          onChange={handleImageUpload}
        /> */}

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
