"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  isNextPage: boolean;
}

function Pagination({ page, isNextPage }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function setPageNumber(direction: string) {
    const pageValue = direction === "prev" ? page - 1 : page + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageValue.toString(),
    });
    router.push(newUrl, { scroll: false });
  }

  return (
    <div className="flex items-center">
      <Button disabled={page === 1} onClick={() => setPageNumber("prev")}>
        <Image
          src="/assets/icons/chevron-left.svg"
          alt="left arrow"
          width={30}
          height={30}
        />
      </Button>
      <Button className="text-lg bg-accent-100">{page}</Button>
      <Button disabled={!isNextPage} onClick={() => setPageNumber("next")}>
        <Image
          src="/assets/icons/chevron-right.svg"
          alt="left arrow"
          width={30}
          height={30}
        />
      </Button>
    </div>
  );
}

export default Pagination;
