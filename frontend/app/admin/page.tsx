"use client";

import { createProduct } from "@/apis/products";
import { useState } from "react";

export default function AddProductPage() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(fd: FormData) {
    setBusy(true);
    setErr(null);
    setOk(null);
    try {
      const payload = {
        name: String(fd.get("name") || ""),
        description: String(fd.get("description") || ""),
        price: Number(fd.get("price") || 0),
        category: String(fd.get("category") || ""),
        image: String(fd.get("image") || ""),
        stock: Number(fd.get("stock") || 0),
      };
      await createProduct(payload);
      setOk("Product created.");
      (document.getElementById("add-form") as HTMLFormElement)?.reset();
    } catch (err: unknown) {
      if (err instanceof Error) setErr(err.message ?? "Failed to load");
      else if (typeof err === "string") setErr(err || "Failed to load");
      else setErr("Failed to load");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container mx-auto max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Add Product</h2>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      {ok && <p className="text-green-600 mb-2">{ok}</p>}

      <form
        id="add-form"
        action={onSubmit}
        className="bg-white border rounded p-4 space-y-3"
      >
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            required
            className="w-full rounded border px-3 py-2 focus:border-orange-500 focus:ring focus:ring-orange-200"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            required
            className="w-full rounded border px-3 py-2 h-24 focus:border-orange-500 focus:ring focus:ring-orange-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min={0}
              required
              className="w-full rounded border px-3 py-2 focus:border-orange-500 focus:ring focus:ring-orange-200"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input
              name="stock"
              type="number"
              min={0}
              required
              className="w-full rounded border px-3 py-2 focus:border-orange-500 focus:ring focus:ring-orange-200"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <input
              name="category"
              placeholder="e.g., accessories"
              required
              className="w-full rounded border px-3 py-2 focus:border-orange-500 focus:ring focus:ring-orange-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Image URL</label>
          <input
            name="image"
            placeholder="https://…"
            className="w-full rounded border px-3 py-2 focus:border-orange-500 focus:ring focus:ring-orange-200"
          />
        </div>

        <button
          disabled={busy}
          className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {busy ? "Saving…" : "Create"}
        </button>
      </form>
    </section>
  );
}
