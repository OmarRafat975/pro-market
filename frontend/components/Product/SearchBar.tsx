"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const searchParam = sp.get("search") ?? "";
  const [value, setValue] = useState(searchParam);

  // keep input synced if user navigates
  useEffect(() => {
    setValue(searchParam);
  }, [searchParam]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // reset page when searching
    router.push(`/?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full sm:max-w-md container px-8"
    >
      <input
        type="text"
        placeholder="Search products…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="
          w-full rounded-l-md border border-orange-300 bg-white
          px-3 py-2 text-sm text-gray-700 shadow-sm
          focus:border-orange-500 outline-none focus:ring focus:ring-orange-200
        "
      />
      <button
        type="submit"
        className="rounded-r-md px-4 py-2 bg-orange-500 text-white font-medium hover:bg-orange-600"
      >
        Search
      </button>
    </form>
  );
}
