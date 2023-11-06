"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CATEGORIES, FILTERS } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

interface Props {
  filter?: boolean;
}

function FilterAndSort({ filter }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleFilterChange(filter: string, value: string) {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: filter,
      value,
    });
    router.push(newUrl, { scroll: false });
  }

  return (
    <div className="mt-8 mb-4 flex flex-col sm:flex-row gap-2 w-full mx-8 justify-center max-w-md">
      {filter && (
        <Select
          defaultValue={searchParams.get("filter") || ""}
          onValueChange={(content) => handleFilterChange("filter", content)}
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

      <Select
        defaultValue={searchParams.get("sort") || ""}
        onValueChange={(content) => handleFilterChange("sort", content)}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {FILTERS.map((filter) => (
            <SelectItem key={filter.value} value={filter.value}>
              {filter.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterAndSort;
