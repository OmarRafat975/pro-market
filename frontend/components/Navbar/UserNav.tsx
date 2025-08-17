"use client";

import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

const UserNav = () => {
  const name = useAuthStore((state) => state.name);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const itemsNum = useCartStore((state) => state.items).reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  return (
    <div className="w-fit">
      {token ? (
        <div className="flex items-center gap-3">
          <div className="w-fit font-bold text-lg text-nowrap">
            Hi, {name[0].toUpperCase() + name.slice(1)}
          </div>
          <Link
            href="/cart"
            className="relative group text-gray-900 hover:text-primary duration-150 transition cursor-pointer py-1 px-2 flex items-center"
          >
            <FaShoppingCart className="text-xl" />
            <div className="absolute bg-red-600 size-4 rounded-full top-0 right-0.5 text-white text-center flex items-center justify-center text-xs font-bold group-hover:bg-primary duration-150 transition">
              {itemsNum}
            </div>
          </Link>
          <button
            onClick={() => logout()}
            className="text-gray-800 border-b border-transparent font-semibold px-4 py-2 rounded-md w-fit hover:text-primary hover:border-primary-bold transition duration-300 disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/login"
            className="bg-primary py-1 px-2 rounded text-white hover:bg-primary-bold transition duration-300"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="underline text-primary hover:text-primary-bold"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserNav;
