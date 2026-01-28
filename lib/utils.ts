import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isUrlValid(value: string | undefined) {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

interface URLQueryProps {
  params: string;
  key: string;
  value: string | null;
}

export function formUrlQuery({ params, key, value }: URLQueryProps) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
}

interface RemoveUrlProps {
  params: string;
  keysToRemove: string[];
}

export function removeUrlKeys({ params, keysToRemove }: RemoveUrlProps) {
  const currentUrl = qs.parse(params);
  keysToRemove.forEach((key) => delete currentUrl[key]);

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
}

export function returnSortOptions(sort: string) {
  let sortOptions = {};

  switch (sort) {
    case "newest":
      sortOptions = { createdAt: -1 };
      break;
    case "oldest":
      sortOptions = { createdAt: 1 };
      break;
    case "name_asc":
      sortOptions = { title: 1 };
      break;
    case "name_desc":
      sortOptions = { title: -1 };
      break;
    default:
      break;
  }

  return sortOptions;
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNumber = (num / 1000000).toFixed(0);
    return `${formattedNumber}m+`;
  } else if (num >= 1000) {
    const formattedNumber = (num / 1000).toFixed(0);
    return `${formattedNumber}k+`;
  } else {
    return num.toString();
  }
};
