"use client";

import React, { useState } from "react";
import * as z from "zod";
import { ReviewSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createReview } from "@/lib/actions/review.action";
import { Textarea } from "./ui/textarea";

interface CreateReviewProps {
  recipe: string;
  user: string;
}

function CreateReview({ recipe, user }: CreateReviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  console.log(user);
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 4,
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ReviewSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!user) {
      router.push("/sign-in");
    }
    if (!values) return;
    try {
      await createReview({
        recipe,
        user,
        rating: Number(values.rating),
        comment: values.comment,
        path: pathname,
      });
      toast.success(`Review posted successfully`, {
        position: "top-right",
        closeOnClick: true,
        autoClose: 5000,
      });
      form.reset();
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
        className="m-8 mt-0 flex flex-col items-start justify-center gap-4 max-w-[500px]"
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="w-full flex gap-4 items-baseline">
              <FormLabel className="mt-4">Rating</FormLabel>
              <FormControl>
                <Input
                  value={field.value}
                  onChange={(event) => field.onChange(+event.target.value)}
                  type="number"
                />
              </FormControl>
              <FormMessage className="text-red-400 w-full" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Comment</FormLabel>
              <Textarea
                {...field}
                placeholder="Let us know your thoughts on this recipe"
              />
              <FormMessage className="text-red-400 w-full" />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} className="btn" type="submit">
          {isLoading ? (
            <span className="flex gap-2">
              <Image
                src="/assets/icons/bubble-loading.svg"
                alt="loading"
                width={20}
                height={20}
              />{" "}
              Posting
            </span>
          ) : (
            "Post"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default CreateReview;
