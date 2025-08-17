import { createOrder } from "@/apis/orders";
import { Item, OrderItem } from "@/types/cart";
import { Product } from "@/types/product";
import { create } from "zustand";

interface CartStore {
  items: Item[];
  addItem: (product: Product, user: string) => void;
  removeItem: (productId: string, user: string) => void;
  decreaseQuantity: (productId: string, user: string) => void;
  setCart: (items: Item[]) => void;
  createAndSendOrder: (user: string) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, user) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product._id === product._id
      );
      if (existing) {
        const newState = {
          items: state.items.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  quantity: Number(item.quantity) + 1,
                }
              : { ...item }
          ),
        };
        localStorage.setItem(
          `cartItems:${user}`,
          JSON.stringify({ items: newState.items })
        );
        return newState;
      }
      localStorage.setItem(
        "cartItems",
        JSON.stringify({
          items: [...state.items, { product, quantity: 1 }],
        })
      );
      return { items: [...state.items, { product, quantity: 1 }] };
    }),
  removeItem: (productId, user) =>
    set((state) => {
      const filteredItems = state.items.filter(
        (item) => item.product._id !== productId
      );
      localStorage.setItem(
        `cartItems:${user}`,
        JSON.stringify({
          items: [...filteredItems],
        })
      );
      return { items: [...filteredItems] };
    }),
  decreaseQuantity: (productId, user) =>
    set((state) => {
      const newItem = state.items
        .map((item) =>
          item.product._id === productId
            ? item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : null
            : item
        )
        .filter((item) => item !== null);

      localStorage.setItem(
        `cartItems:${user}`,
        JSON.stringify({
          items: [...newItem],
        })
      );
      return { items: [...newItem] };
    }),

  setCart: (items: Item[]) =>
    set((state) => ({
      items,
    })),

  createAndSendOrder: async (user: string) => {
    const items = get().items;
    const order: { items: OrderItem[] } = {
      items: items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
    };
    set(() => {
      localStorage.removeItem(`cartItems:${user}`);

      return { items: [] };
    });
    await createOrder(order);
  },
}));
