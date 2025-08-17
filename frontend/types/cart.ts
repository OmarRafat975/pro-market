import { Product } from "./product";

export type Item = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  quantity: number;
};
