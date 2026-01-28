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
import { formUrlQuery, removeUrlKeys } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";

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

  function clearFilters() {
    const newUrl = removeUrlKeys({
      params: searchParams.toString(),
      keysToRemove: ["filter", "sort"],
    });
    router.push(newUrl, { scroll: false });
  }

  return (
    <div className="mt-8 mb-4 flex flex-col sm:flex-row gap-3 w-full px-8 justify-center items-center max-w-lg z-30">
      {filter && (
        <Select
          defaultValue={searchParams.get("filter") || ""}
          onValueChange={(content) => handleFilterChange("filter", content)}
        >
          <SelectTrigger className="w-full">
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
        <SelectTrigger className="w-full">
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
      {searchParams.toString() && (
        <Button className="danger-btn w-full" onClick={clearFilters}>
          Clear filters
          <Image
            src="/assets/icons/cross.svg"
            alt="cross"
            width={20}
            height={20}
          />
        </Button>
      )}
    </div>
  );
}

export default FilterAndSort;
