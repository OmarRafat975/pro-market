"use client";

import ItemCard from "@/components/Cart/ItemCard";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { BsEnvelopePlus } from "react-icons/bs";

const CartPage = () => {
  const user = useAuthStore((state) => state.name);
  const status = useAuthStore((state) => state.status);

  const cartItems = useCartStore((state) => state.items);
  const createOrder = useCartStore((state) => state.createAndSendOrder);
  const router = useRouter();

  const handleCreateOrder = () => {
    if (cartItems.length === 0) return;
    createOrder(user);
    router.replace("/orders");
  };
  return (
    <div>
      {cartItems.map((item) => (
        <ItemCard item={item} key={item.product._id + item.quantity} />
      ))}
      <button
        disabled={cartItems.length === 0 || status !== "authenticated"}
        onClick={handleCreateOrder}
        className="bg-primary text-white w-fit my-2 mx-auto px-3 py-2 rounded flex items-center justify-center gap-2 hover:bg-primary-bold transition duration-300 disabled:opacity-50"
      >
        <BsEnvelopePlus /> Send Order
      </button>
    </div>
  );
};

export default CartPage;
