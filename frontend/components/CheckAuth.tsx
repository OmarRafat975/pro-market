"use client";

import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { Item } from "@/types/cart";
import { useCallback, useEffect } from "react";

function loadCartForUser(user?: string): Item[] {
  if (typeof window === "undefined" || !user) return [];
  try {
    const key = `cartItems:${user}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.items)) return parsed.items as Item[];

    return [];
  } catch (e) {
    console.error("Failed to parse cartItems", e);
    return [];
  }
}

const CheckAuth = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const user = useAuthStore((state) => state.name);
  const setCart = useCartStore((state) => state.setCart);

  const hydrateCart = useCallback(() => {
    const items = loadCartForUser(user);
    setCart(items);
  }, [user, setCart]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) hydrateCart();
  }, [user, hydrateCart]);

  return null;
};

export default CheckAuth;
