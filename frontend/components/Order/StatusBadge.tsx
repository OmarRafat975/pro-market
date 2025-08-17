"use client";

import { BsDot } from "react-icons/bs";
import clsx from "clsx";

export default function StatusBadge({ status }: { status: string }) {
  const color = clsx({
    "text-yellow-400": status === "pending",
    "text-blue-400": status === "shipped",
    "text-green-500": status === "delivered",
    "text-gray-500": !["pending", "shipped", "delivered"].includes(status),
  });

  return (
    <p
      className={clsx(
        "font-semibold text-xl text-center my-3 flex items-center justify-center rounded",
        color
      )}
      aria-label={`Status: ${status}`}
    >
      <BsDot className="text-6xl font-bold mt-1 pl-2" />
      {status}
    </p>
  );
}
