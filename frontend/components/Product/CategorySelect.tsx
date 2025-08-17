"use client";

import { useRouter } from "next/navigation";

export default function CategorySelect({
  categories,
  page,
  limit,
  search,
}: {
  categories: string[];
  search: string;
  page: string | string[] | number;
  limit: string | string[] | number;
}) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    router.push(`/?page=${1}&limit=${limit}&category=${cat}&search=${search}`);
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      <label htmlFor="category" className="hidden sm:inline font-bold">
        Categories:{" "}
      </label>
      <select
        onChange={handleChange}
        defaultValue=""
        id="category"
        className="
      block w-fit rounded-md border border-orange-300
      bg-white px-3 py-2 text-sm font-medium text-gray-700
      shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200
      focus:ring-opacity-50
      "
      >
        <option value="" className="text-gray-400">
          All Categories
        </option>
        {categories.map((cat) => (
          <option
            key={cat}
            value={cat}
            className="bg-white text-gray-700 hover:bg-orange-100"
          >
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
