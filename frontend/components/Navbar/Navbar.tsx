"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "@/public/logo.png";
import Link from "next/link";
import NavLink from "./NavLink";

import { FaBars, FaTimes } from "react-icons/fa";
import UserNav from "./UserNav";
import { useAuthStore } from "@/stores/authStore";

const navLinks = [{ name: "Home", href: "/" }];
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const role = useAuthStore((state) => state.role);

  return (
    <nav className="bg-white border-b border-gray-700 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between item-center">
        <Link href="/" className="w-fit">
          <Image src={logo} alt="pro market logo" width={50} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center w-full gap-6">
          <div className="text-sm text-gray-900 flex items-center justify-center gap-2 w-full mx-auto">
            {navLinks.map(({ href, name }) => (
              <NavLink key={href + name} href={href} name={name} />
            ))}

            {(role === "user" || role === "admin") && (
              <NavLink href={"/orders"} name={"Orders"} />
            )}
            {role === "admin" && <NavLink href={"/admin"} name={"Dashboard"} />}
          </div>
          <UserNav />
        </div>

        {/* Hamburger Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            className="text-gray-900 text-xl cursor-pointer"
            title="menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="bg-white border-t border-gray-700 px-6 py-4 space-y-2 sm:space-x-4 text-center md:hidden flex flex-col justify-center items-center sm:block">
          <UserNav />
          {navLinks.map(({ href, name }) => (
            <NavLink
              key={href + name}
              name={name}
              className=""
              href={href}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
