"use client";

import React, { useState } from "react";
import * as z from "zod";
import { ProfileSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { updateUserBioAndLinks } from "@/lib/actions/user.action";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface EditProfileProps {
  bio: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youTube: string;
  };
}

function EditProfile({ bio, socialLinks }: EditProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      bio: bio || "",
      socialLinks: {
        instagram: socialLinks?.instagram || "",
        facebook: socialLinks?.facebook || "",
        youTube: socialLinks?.youTube || "",
      },
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      await updateUserBioAndLinks({
        clerkId: userId!,
        updateData: { ...values },
        path: pathname,
      });
      toast.success(`Profile updated successfully`, {
        position: "top-right",
        closeOnClick: true,
        autoClose: 5000,
      });
      form.reset();
      router.push(`/profile/${userId}`);
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
          name="bio"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="h3 mt-4">Bio</FormLabel>
              <FormControl>
                <Input placeholder="A short information about you" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormLabel className="h3 mt-4">Social Links</FormLabel>

        <FormField
          control={form.control}
          name={`socialLinks.instagram`}
          render={({ field }) => (
            <FormItem className="flex gap-4 items-baseline">
              <FormLabel>Instagram</FormLabel>
              <Input {...field} placeholder="Instagram profile" />
              <FormMessage className="text-red-400 w-full" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`socialLinks.facebook`}
          render={({ field }) => (
            <FormItem className="flex gap-4 items-baseline">
              <FormLabel>Facebook</FormLabel>
              <Input {...field} placeholder="Facebook profile" />
              <FormMessage className="text-red-400 w-full" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`socialLinks.youTube`}
          render={({ field }) => (
            <FormItem className="flex gap-4 items-baseline">
              <FormLabel>YouTube</FormLabel>
              <Input {...field} placeholder="YouTube Channel" />
              <FormMessage className="text-red-400 w-full" />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className="btn mt-8" type="submit">
          {isLoading ? (
            <span className="flex gap-2">
              <Image
                src="/assets/icons/bubble-loading.svg"
                alt="loading"
                width={20}
                height={20}
              />{" "}
              Saving
            </span>
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default EditProfile;
