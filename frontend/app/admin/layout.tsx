"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const role = useAuthStore((state) => state.role);

  if (role !== "admin")
    return (
      <div className="text-red-600 font-semibold text-center">
        Unauthorized!
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/admin"
            className="font-semibold text-orange-600 w-full text-center block"
          >
            Admin Dashboard
          </Link>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-64 min-h-[calc(100vh-56px)] border-r bg-white">
          <nav className="flex flex-col gap-2 p-4">
            <NavLink href="/admin/" label="Add Product" />
            <NavLink href="/admin/list" label="Products" />
            <NavLink href="/admin/orders" label="Orders" />
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-l border border-gray-200 border-r-0 transition-colors hover:bg-orange-50"
    >
      {label}
    </Link>
  );
}
