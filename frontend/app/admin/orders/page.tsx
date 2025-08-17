"use client";

import { getOrders, updateOrderStatus } from "@/apis/orders";
import { Order } from "@/types/order";
import { useEffect, useState } from "react";

const STATUS: Order["status"][] = ["pending", "shipped", "delivered"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await getOrders();
      setOrders(res);
    } catch (err: unknown) {
      if (err instanceof Error) setErr(err.message ?? "Failed to load");
      else if (typeof err === "string") setErr(err || "Failed to load");
      else setErr("Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onStatusChange(id: string, status: Order["status"]) {
    try {
      const updated = await updateOrderStatus(id, status); // PATCH /orders/:id/status :contentReference[oaicite:7]{index=7}
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch (err: unknown) {
      if (err instanceof Error) setErr(err.message ?? "Failed to load");
      else if (typeof err === "string") setErr(err || "Failed to load");
      else setErr("Failed to load");
    }
  }

  return (
    <section className="container mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Orders</h2>
        <button
          onClick={load}
          className="px-3 py-1.5 rounded bg-white border hover:bg-orange-50"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}

      <div className="space-y-3">
        {orders.map((o) => (
          <article key={o._id} className="bg-white border rounded p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">Order #{o._id.slice(-6)}</p>
                <p className="text-sm text-gray-600">
                  Placed {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${o.total.toFixed(2)}</p>
                <select
                  className="mt-1 rounded border px-2 py-1 bg-white focus:border-orange-500 focus:ring focus:ring-orange-200"
                  value={o.status}
                  onChange={(e) =>
                    onStatusChange(o._id, e.target.value as Order["status"])
                  }
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
              {o.items.map((it, idx) => (
                <li key={idx}>
                  {it.productId.name}× {it.quantity}
                </li>
              ))}
            </ul>
          </article>
        ))}

        {!loading && orders.length === 0 && (
          <p className="text-gray-500">No orders.</p>
        )}
      </div>
    </section>
  );
}
