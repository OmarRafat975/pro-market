"use client";

import useSWR from "swr";
import { getMyOrders } from "@/apis/orders";
import { Order } from "@/types/order";
import OrdersList from "@/components/Order/OrderList";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const fetchOrders = async (): Promise<Order[]> => {
  const data = await getMyOrders();
  return data ?? [];
};

export default function OrdersPage() {
  const {
    data: orders,
    error,
    isLoading,
  } = useSWR<Order[]>("my-orders", fetchOrders, {
    shouldRetryOnError: true,
  });

  const status = useAuthStore((state) => state.status);

  if (status !== "authenticated")
    return (
      <>
        <div className="p-6 text-red-600 text-center">
          You need to login to access this page
        </div>
        <Link
          href="/login"
          className="font-bold text-primary decoration-0 flex items-center justify-center gap-3"
        >
          <FaArrowLeft /> Login now
        </Link>
      </>
    );

  if (isLoading) {
    return (
      <div className="space-y-3 p-5">
        <div className="h-24 bg-amber-50 border border-gray-200 animate-pulse rounded" />
        <div className="h-24 bg-amber-50 border border-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 text-center">
        Failed to load orders. Please try again.
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return <div className="p-6 text-gray-600">No orders yet.</div>;
  }

  return <OrdersList orders={orders} />;
}
