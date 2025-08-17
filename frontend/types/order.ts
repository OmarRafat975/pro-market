export type Product = { _id: string; name: string };

export type OrderItem = {
  productId: Product;
  quantity: number;
};

export type OrderStatus = "pending" | "shipped" | "delivered" | string;

export type Order = {
  _id: string;
  createdAt: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
};
