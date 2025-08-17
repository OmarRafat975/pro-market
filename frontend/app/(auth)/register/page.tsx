"use client";

import {
  validateEmail,
  validatePassword,
  validateString,
} from "@/lib/validation";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [valError, setValError] = useState<Record<string, string>>({
    name: "",
    email: "",
    password: "",
  });

  const register = useAuthStore((state) => state.register);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Name validation
    if (!validateString(formData.name)) {
      newErrors.name = "Name is required and must be more that 2 characters";
    }
    //Password Validation
    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
    }
    if (Object.keys(newErrors).length > 0) {
      setValError(newErrors);
      return;
    }
    register(formData);
    setValError({});
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    router.replace("/");
  }

  if (status === "authenticated")
    return (
      <>
        <div className="p-6 text-red-600 text-center">
          You are Already Logged In
        </div>
        <Link
          href="/"
          className="font-bold text-primary decoration-0 flex items-center justify-center gap-3"
        >
          <FaArrowLeft /> Go Back Home
        </Link>
      </>
    );

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          className="w-full border border-gray-100 rounded-md p-2"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="off"
        />
        {valError.name && (
          <div className="text-red-600 text-center my-1">{valError.name}</div>
        )}
        <input
          type="email"
          name="email"
          className="w-full border border-gray-100 rounded-md p-2"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
        />
        {valError.email && (
          <div className="text-red-600 text-center my-1">{valError.email}</div>
        )}
        <input
          type="password"
          name="password"
          className="w-full border border-gray-100 rounded-md p-2"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="off"
        />
        {valError.password && (
          <div className="text-red-600 text-center my-1">
            {valError.password}
          </div>
        )}
        <button
          disabled={status === "loading"}
          className="bg-primary text-white font-semibold px-4 py-2 rounded-md w-full hover:bg-primary-bold transition duration-300 disabled:opacity-50"
        >
          {status === "loading" ? "Registering..." : "Register"}
        </button>{" "}
        {status === "error" && error && (
          <div className="text-red-600 text-center my-1">{error.message}</div>
        )}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            {" "}
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
