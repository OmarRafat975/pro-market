import { FaTruck } from "react-icons/fa";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDateISO, itemsLine } from "@/lib/utils";
import { Order } from "@/types/order";

export default function OrderCard({ order }: { order: Order }) {
  return (
    <article className="bg-amber-50 border border-gray-300 text-gray-700 rounded">
      <div className="w-full container mx-auto grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-center p-5 text-xs sm:text-sm">
        <div className="text-3xl">
          <FaTruck aria-label="Order" />
        </div>

        <div>
          <p className="font-bold text-xl sm:text-2xl leading-snug flex">
            {itemsLine(order.items)}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
          <p>Date: {formatDateISO(order.createdAt)}</p>
        </div>

        <p className="sm:text-[15px] text-2xl font-bold">
          Total: {formatCurrency(order.total)}
        </p>

        <StatusBadge status={order.status} />
      </div>
    </article>
  );
}
