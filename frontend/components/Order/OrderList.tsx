import { Order } from "@/types/order";
import OrderCard from "./OrderCard";

export default function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <OrderCard key={o._id} order={o} />
      ))}
    </div>
  );
}
