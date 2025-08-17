import api, { normalizeAxiosError } from "@/lib/axios";
import { OrderItem } from "@/types/cart";

export const createOrder = async (order: { items: OrderItem[] }) => {
  try {
    await api.post("/orders", JSON.stringify(order));
  } catch (error: any) {
    throw normalizeAxiosError(error, "Failed to create order");
  }
};

export const getMyOrders = async () => {
  try {
    const res = await api.get("/orders/me");
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw normalizeAxiosError(error, "Failed to get my order");
  }
};

export const getOrders = async () => {
  try {
    const res = await api.get("/orders/");
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw normalizeAxiosError(error, "Failed to get orders");
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw normalizeAxiosError(error, "Failed to get orders");
  }
};
