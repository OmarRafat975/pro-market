"use client";

import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { Product } from "@/types/product";
import { FaPlus } from "react-icons/fa";

const AddCartButton = ({ product }: { product: Product }) => {
  const addProduct = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.name);

  return (
    <button
      className="bg-primary text-white w-full my-2 py-2 rounded flex items-center justify-center gap-2 hover:bg-primary-bold transition duration-300"
      onClick={() => addProduct(product, user)}
    >
      <FaPlus /> Add to cart
    </button>
  );
};

export default AddCartButton;
