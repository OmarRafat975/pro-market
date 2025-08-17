"use client";

import { isValidImgUrl } from "@/lib/validation";
import { Item } from "../../types/cart";
import Image from "next/image";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

const ItemCard = ({ item }: { item: Item }) => {
  const user = useAuthStore((state) => state.name);
  const addItem = useCartStore((state) => state.addItem);
  const remove = useCartStore((state) => state.removeItem);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  return (
    <div className="py-4 bg-amber-50 border-t border-b text-gray-700 ">
      <div className="container mx-auto grid grid-cols-[1fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
        <div className="flex items-start gap-6">
          <Image
            className="w-20 sm:w-36 h-16 sm:h-28"
            src={isValidImgUrl(item.product.image)}
            alt={item.product.name}
            width={360}
            height={360}
          />
          <div className="">
            <p className="text-xs sm:text-lg font-bold">{item.product.name}</p>
            <div className="flex items-center gap-5 my-2">
              <p>${item.product.price}</p>
            </div>
            <p>{item.product.description}</p>
          </div>
        </div>
        <div className="flex gap-4 justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => addItem(item.product, user)}
              className="px-1  rounded-xl  hover:text-blue-600 transition-colors "
            >
              {<FaPlus />}
            </button>
            <span className="border px-2 text-lg text-center border-primary bg-white">
              {item.quantity}
            </span>
            <button
              onClick={() => decreaseQuantity(item.product._id, user)}
              className="px-1 rounded-xl hover:text-red-600 transition-colors"
            >
              {<FaMinus />}
            </button>

            <div>
              <b>Total:</b> ${item.quantity * item.product.price}
            </div>
          </div>
          <button
            onClick={() => remove(item.product._id, user)}
            className="transition-colors hover:text-red-600 active:text-white"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
