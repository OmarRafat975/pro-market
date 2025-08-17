"use client";

import { validateEmail, validateString } from "@/lib/validation";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [valError, setValError] = useState<Record<string, string>>({
    email: "",
    password: "",
  });

  const login = useAuthStore((state) => state.login);
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
    if (!validateString(formData.password, 8)) {
      newErrors.password = "Please enter a valid password";
    }

    if (Object.keys(newErrors).length > 0) {
      setValError(newErrors);
      return;
    }
    login(formData);
    setValError({});
    setFormData({
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
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
          className="bg-primary text-white font-semibold px-4 py-2 rounded-md w-full hover:bg-primary-bold transition duration-300 disabled:opacity-50 mt-2"
        >
          {status === "loading" ? "Logining..." : "Login"}
        </button>{" "}
        {status === "error" && error && (
          <div className="text-red-600 text-center my-1">{error.message}</div>
        )}
        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            {" "}
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
