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

function CreateRecipeForm() {
  const [imageUrl, setImageUrl] = useState("");

  const form = useForm<z.infer<typeof RecipeSchema>>({
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      category: "",
      cuisine: "",
      author: "author",
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
      setImageUrl(file.name);
      form.setValue("image", file.name);
    }
  }

  async function deletedUploadedImage() {
    await deleteImage(imageUrl);
    setImageUrl("");
    form.setValue("image", "");
  }

  function onSubmit(values: z.infer<typeof RecipeSchema>) {
    // 2. Define a submit handler.
    form.setValue("author", "author");
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
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

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3 w-full sm:flex-row mt-4 ">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <Select
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
            )}
          />

          <FormField
            control={form.control}
            name="cuisine"
            render={({ field }) => (
              <Select
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
            )}
          />
        </div>

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

        <Button className="btn mt-8" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default CreateRecipeForm;
