"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import { searchQueries } from "@/lib/actions/search.action";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";

function Searchbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<
    { type: string; id: string; title: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef(null);

  const query = searchParams.get("query");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
    if (!isOpen) setIsOpen(true);
    if (event.target.value === "" && isOpen) setIsOpen(false);
  }

  useEffect(() => {
    const fetchResults = async () => {
      setResult([]);
      if (query) {
        try {
          setIsLoading(true);
          const response = (await searchQueries(query)) as string;
          setResult(JSON.parse(response));
        } catch (error: any) {
          console.log(error);
          toast.error(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    if (query) fetchResults();
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    setIsOpen(false);
    setSearchQuery("");
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [pathname]);

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
        <div
          ref={searchContainerRef}
          className="w-full absolute top-10 shadow-md h-[400px] z-50 bg-white rounded-b-md px-4 py-2 overflow-y-scroll"
        >
          {isLoading ? (
            <Image
              src="/assets/icons/bubble-loading.svg"
              alt="loading"
              width={30}
              height={30}
              className="mx-auto"
            />
          ) : (
            <>
              {result?.length > 0 ? (
                result.map((item) => (
                  <div
                    key={item.id}
                    className="hover:bg-accent-100 p-2 rounded-lg"
                  >
                    <Link
                      href={
                        item?.type === "user"
                          ? `/profile/${item.id}`
                          : `/recipe/${item.id}`
                      }
                      key={item.id}
                    >
                      <p className="font-semibold capitalize">{item.title}</p>
                      <p className="mb-2">{item.type}</p>
                    </Link>
                  </div>
                ))
              ) : (
                <p>No results found!</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Searchbar;
