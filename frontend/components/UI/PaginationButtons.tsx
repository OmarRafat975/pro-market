"use client";

import { Product } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";

const PaginationButtons = ({
  totalPages,
  category,
  search,
  products,
}: {
  totalPages: number;
  category: string;
  search: string;
  products: Product[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? 1;
  const limit = searchParams.get("limit") ?? 10;

  if (totalPages <= 1 || products.length < 10) return null;
  return (
    <div className="container flex items-center justify-center gap-4 w-full">
      <button
        className="bg-primary text-white px-2 py-1 rounded hover:bg-primary-bold"
        disabled={+page - 1 < 1}
        onClick={() =>
          router.push(
            `/?page=${
              +page - 1
            }&limit=${limit}&category=${category}&search=${search}`
          )
        }
      >
        {"<"}
      </button>
      <div>{page + "/ " + totalPages}</div>
      <button
        className="bg-primary text-white px-2 py-1 rounded hover:bg-primary-bold"
        disabled={+page + 1 > totalPages}
        onClick={() =>
          router.push(
            `/?page=${
              +page + 1
            }&limit=${limit}&category=${category}&search=${search}`
          )
        }
      >
        {">"}
      </button>
    </div>
  );
};

export default PaginationButtons;
