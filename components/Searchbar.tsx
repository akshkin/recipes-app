"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

function Searchbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
    if (!isOpen) setIsOpen(true);
    if (event.target.value === "" && isOpen) setIsOpen(false);
  }

  useEffect(() => {
    const delayDebounceFunction = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });
        router.push(newUrl, { scroll: false });
      }
      return () => clearTimeout(delayDebounceFunction);
    }, 300);
  }, [searchQuery, router, pathname, searchParams]);

  return (
    <div className="relative sm:w-[250px]  lg:w-[500px]  max-sm:hidden">
      <Input
        className="w-full"
        type="search"
        placeholder="Search recipes or authors"
        onChange={handleChange}
        value={searchQuery}
      />
      {isOpen && (
        <div className="w-full absolute top-10 shadow-md h-[400px] z-10 bg-white rounded-b-md"></div>
      )}
    </div>
  );
}

export default Searchbar;
