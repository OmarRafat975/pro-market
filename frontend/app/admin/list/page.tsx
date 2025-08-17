"use client";

import useSWR from "swr";
import { deleteProduct, getProducts, updateProduct } from "@/apis/products";
import { isValidImgUrl } from "@/lib/validation";
import { Product } from "@/types/product";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Drafts = Record<string, Partial<Product>>;
type Saving = Record<string, boolean>;
type Errors = Record<string, string | null>;
type EditableKey =
  | "name"
  | "category"
  | "description"
  | "price"
  | "stock"
  | "image";

type ProductsResponse = {
  products: Product[];
  total: number;
  pages: number;
  allCategories: string[];
};

function castValue<K extends EditableKey>(key: K, value: string): Product[K] {
  if (key === "price" || key === "stock") return Number(value) as Product[K];
  return value as Product[K];
}

export default function ProductsPage() {
  // Server-driven pagination & filters
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [cat, setCat] = useState<string>("");
  const [query, setQuery] = useState("");

  // SWR fetcher: back end provides total + pages
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    ["products:list", page, perPage, cat],
    ([, p, l, c]) => getProducts(p as number, l as number, c as string),
    { revalidateOnFocus: false }
  );

  // Local UI state (inline edit)
  const [drafts, setDrafts] = useState<Drafts>({});
  const [saving, setSaving] = useState<Saving>({});
  const [rowErr, setRowErr] = useState<Errors>({});
  const [imgEdit, setImgEdit] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState<string | null>(null);

  // Reset to first page when filters or page size change
  useEffect(() => {
    setPage(1);
  }, [cat, perPage]);

  // Apply client-side search on current page only (API has no `search`)
  const pageRows = useMemo(() => {
    const base = data?.products ?? [];
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [data, query]);

  const totalPages = data?.pages ?? 1;
  const totalItems = data?.total ?? 0;

  const topError =
    err ??
    (error
      ? error instanceof Error
        ? error.message
        : "Failed to load products"
      : null);

  const hasChanges = (id: string) =>
    !!drafts[id] && Object.keys(drafts[id]).length > 0;

  const onChangeField = <K extends EditableKey>(
    p: Product,
    field: K,
    value: string
  ) => {
    setRowErr((r) => ({ ...r, [p._id]: null }));
    setDrafts((prev) => {
      const next: Partial<Product> = { ...(prev[p._id] ?? {}) };
      const cast = castValue(field, value);

      if (p[field] === cast) delete next[field];
      else next[field] = cast;

      if (Object.keys(next).length === 0) {
        const { [p._id]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [p._id]: next };
    });
  };

  const onResetRow = (id: string) => {
    setDrafts((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
    setRowErr((r) => ({ ...r, [id]: null }));
    setImgEdit((s) => ({ ...s, [id]: false }));
  };

  const baseFrom = (
    current: ProductsResponse | undefined
  ): ProductsResponse => ({
    products: current?.products ?? [],
    total: current?.total ?? 0,
    pages: current?.pages ?? 0,
    allCategories: current?.allCategories ?? [],
  });

  // Optimistic Update (affects current page cache)
  const onUpdateRow = async (p: Product) => {
    const d = drafts[p._id];
    if (!d || Object.keys(d).length === 0) return;

    setSaving((s) => ({ ...s, [p._id]: true }));
    setRowErr((r) => ({ ...r, [p._id]: null }));

    const optimistic = { ...p, ...d } as Product;

    await mutate(
      async (current): Promise<ProductsResponse> => {
        try {
          const updated = await updateProduct(p._id, d);
          const base = baseFrom(current);
          return {
            ...base,
            products: base.products.map((r) => (r._id === p._id ? updated : r)),
          };
        } catch (e: unknown) {
          setRowErr((r) => ({
            ...r,
            [p._id]: e instanceof Error ? e.message : "Update failed",
          }));
          throw e;
        } finally {
          setSaving((s) => ({ ...s, [p._id]: false }));
        }
      },
      {
        optimisticData: (current): ProductsResponse => {
          const base = baseFrom(current);
          return {
            ...base,
            products: base.products.map((r) =>
              r._id === p._id ? optimistic : r
            ),
          };
        },
        rollbackOnError: true,
        revalidate: true, // ensure server state after update
      }
    );

    onResetRow(p._id);
  };

  // Optimistic Delete (current page only)
  async function onDelete(id: string) {
    if (!confirm("Delete this product?")) return;

    await mutate(
      async (current): Promise<ProductsResponse> => {
        try {
          await deleteProduct(id);
          const base = baseFrom(current);
          return {
            ...base,
            products: base.products.filter((r) => r._id !== id),
          };
        } catch (e: unknown) {
          alert(e instanceof Error ? e.message : "Delete failed");
          throw e;
        } finally {
          onResetRow(id);
        }
      },
      { rollbackOnError: true, revalidate: true }
    );

    // If page got empty after deletion, go back one page
    if (pageRows.length === 1 && page > 1) setPage((p) => p - 1);
  }

  const toggleImgEdit = (id: string) =>
    setImgEdit((s) => ({ ...s, [id]: !s[id] }));
  const imgUrl = (p: Product, d?: Partial<Product>) =>
    (d?.image as string) || p.image || "";
  const refresh = () => mutate();

  // Pagination controls
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const gotoFirst = () => setPage(1);
  const gotoPrev = () => canPrev && setPage((p) => p - 1);
  const gotoNext = () => canNext && setPage((p) => p + 1);
  const gotoLast = () => setPage(totalPages);

  // Display range based on server paging window
  const windowStart = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const windowEnd = Math.min(page * perPage, totalItems);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-transparent">
      {/* Top bar */}
      <section className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
            <p className="text-sm text-neutral-500">
              Manage your catalog, update inline, and preview images.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-orange-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 11-5 5H5a7 7 0 107.75-6.95"
                  fill="currentColor"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mt-6 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                placeholder="Search this page by name, category, or description…"
                className="w-full rounded-lg border px-3 py-2 pl-9 outline-none focus:border-orange-500 focus:ring focus:ring-orange-200"
              />
              <svg
                className="absolute left-3 top-2.5"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.71.71l.27.28v.79L20 21.49 21.49 20l-5.99-6zM6.5 11a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <div className="sm:col-span-1">
            <select
              value={cat}
              onChange={(e) => setCat(e.currentTarget.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-500 focus:ring focus:ring-orange-200"
            >
              <option value="">All categories</option>
              {(data?.allCategories ?? []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.currentTarget.value))}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-500 focus:ring focus:ring-orange-200"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* States */}
        {isLoading && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-full rounded bg-neutral-100" />
              ))}
            </div>
          </div>
        )}

        {topError && !isLoading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
            {topError}
          </div>
        )}

        {/* Table / Cards */}
        {!isLoading && !topError && (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            {/* Table ≥ sm */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[960px] text-sm">
                <thead className="sticky top-0 z-10 bg-orange-100/80 backdrop-blur">
                  <tr className="text-orange-700">
                    <th className="p-3 text-left font-semibold">Image</th>
                    <th className="p-3 text-left font-semibold">Name</th>
                    <th className="p-3 text-left font-semibold">Category</th>
                    <th className="p-3 text-left font-semibold">Description</th>
                    <th className="p-3 text-right font-semibold">Price</th>
                    <th className="p-3 text-right font-semibold">Stock</th>
                    <th className="p-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((p, idx) => {
                    const d = drafts[p._id] ?? {};
                    const isSaving = !!saving[p._id];
                    const errorMsg = rowErr[p._id];
                    const zebra =
                      idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60";

                    return (
                      <tr
                        key={p._id}
                        className={`${zebra} border-t transition-colors hover:bg-orange-50/50`}
                      >
                        {/* Image */}
                        <td className="p-3 align-top">
                          <div className="relative inline-block">
                            {!imgEdit[p._id] ? (
                              <>
                                <Image
                                  src={isValidImgUrl(p.image)}
                                  alt={p.name}
                                  className="h-16 w-16 rounded-md border object-cover"
                                  width={160}
                                  height={160}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      "https://via.placeholder.com/80x80?text=No+Image";
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setImgEdit((s) => ({ ...s, [p._id]: true }))
                                  }
                                  className="absolute -right-2 -top-2 rounded-md bg-orange-500 px-2 py-0.5 text-xs font-medium text-white shadow hover:bg-orange-600"
                                >
                                  Change
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <input
                                  defaultValue={imgUrl(p, d)}
                                  onChange={(e) =>
                                    onChangeField(
                                      p,
                                      "image",
                                      e.currentTarget.value
                                    )
                                  }
                                  placeholder="https://…"
                                  className="w-64 rounded-md border px-2 py-1 outline-none focus:border-orange-500 focus:ring focus:ring-orange-200"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setImgEdit((s) => ({
                                      ...s,
                                      [p._id]: false,
                                    }))
                                  }
                                  className="rounded-md bg-orange-500 px-2 py-1 text-sm font-medium text-white hover:bg-orange-600"
                                >
                                  Done
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Name */}
                        <td className="p-3 align-top">
                          <input
                            defaultValue={p.name}
                            onChange={(e) =>
                              onChangeField(p, "name", e.currentTarget.value)
                            }
                            className="w-full rounded-md border px-2 py-1 outline-none focus:border-orange-500 focus:ring focus:ring-orange-200"
                          />
                        </td>

                        {/* Category */}
                        <td className="p-3 align-top">
                          <input
                            defaultValue={p.category}
                            onChange={(e) =>
                              onChangeField(
                                p,
                                "category",
                                e.currentTarget.value
                              )
                            }
                            className="w-full rounded-md border px-2 py-1 outline-none focus:border-orange-500 focus:ring focus:ring-orange-200"
                          />
                        </td>

                        {/* Description */}
                        <td className="p-3 align-top">
                          <textarea
                            defaultValue={p.description}
                            onChange={(e) =>
                              onChangeField(
                                p,
                                "description",
                                e.currentTarget.value
                              )
                            }
                            className="h-16 w-full resize-y rounded-md border px-2 py-1 outline-none focus:border-orange-500 focus:ring focus:ring-orange-200"
                          />
                        </td>

                        {/* Price */}
                        <td className="p-3 text-right align-top">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            defaultValue={p.price}
                            onChange={(e) =>
                              onChangeField(p, "price", e.currentTarget.value)
                            }
                            className="w-28 rounded-md border px-2 py-1 text-right outline-none focus:border-orange-500 focus:ring focus:ring-orange-200"
                          />
                        </td>

                        {/* Stock */}
                        <td className="p-3 text-right align-top">
                          <input
                            type="number"
                            min={0}
                            defaultValue={p.stock}
                            onChange={(e) =>
                              onChangeField(p, "stock", e.currentTarget.value)
                            }
                            className="w-20 rounded-md border px-2 py-1 text-right outline-none focus:border-orange-500 focus:ring focus:ring-orange-200"
                          />
                        </td>

                        {/* Actions */}
                        <td className="p-3 align-top">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => onUpdateRow(p)}
                              disabled={!hasChanges(p._id) || isSaving}
                              className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                            >
                              {isSaving ? "Saving…" : "Update"}
                            </button>
                            <button
                              onClick={() => onResetRow(p._id)}
                              disabled={!hasChanges(p._id) || isSaving}
                              className="rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-orange-50 disabled:opacity-50"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => onDelete(p._id)}
                              disabled={isSaving}
                              className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                          {errorMsg && (
                            <p className="mt-1 text-xs text-red-600">
                              {errorMsg}
                            </p>
                          )}
                          {hasChanges(p._id) && !errorMsg && (
                            <p className="mt-1 text-xs text-orange-600">
                              Unsaved changes
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {pageRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-10 text-center text-neutral-500"
                      >
                        No products match your page filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards < sm */}
            <div className="sm:hidden divide-y">
              {pageRows.length === 0 ? (
                <div className="p-10 text-center text-neutral-500">
                  No products match your page filter.
                </div>
              ) : (
                pageRows.map((p) => {
                  const d = drafts[p._id] ?? {};
                  const isSaving = !!saving[p._id];
                  const errorMsg = rowErr[p._id];

                  return (
                    <div key={p._id} className="p-4">
                      <div className="flex gap-3">
                        <Image
                          src={isValidImgUrl(p.image)}
                          alt={p.name}
                          className="h-16 w-16 rounded-md border object-cover"
                          width={160}
                          height={160}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                        <div className="flex-1">
                          <input
                            defaultValue={p.name}
                            onChange={(e) =>
                              onChangeField(p, "name", e.currentTarget.value)
                            }
                            className="mb-2 w-full rounded-md border px-2 py-1"
                          />
                          <input
                            defaultValue={p.category}
                            onChange={(e) =>
                              onChangeField(
                                p,
                                "category",
                                e.currentTarget.value
                              )
                            }
                            className="mb-2 w-full rounded-md border px-2 py-1"
                          />
                          <textarea
                            defaultValue={p.description}
                            onChange={(e) =>
                              onChangeField(
                                p,
                                "description",
                                e.currentTarget.value
                              )
                            }
                            className="h-16 w-full resize-y rounded-md border px-2 py-1"
                          />
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              defaultValue={p.price}
                              onChange={(e) =>
                                onChangeField(p, "price", e.currentTarget.value)
                              }
                              className="rounded-md border px-2 py-1 text-right"
                            />
                            <input
                              type="number"
                              min={0}
                              defaultValue={p.stock}
                              onChange={(e) =>
                                onChangeField(p, "stock", e.currentTarget.value)
                              }
                              className="rounded-md border px-2 py-1 text-right"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => onUpdateRow(p)}
                          disabled={!hasChanges(p._id) || isSaving}
                          className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                        >
                          {isSaving ? "Saving…" : "Update"}
                        </button>
                        <button
                          onClick={() => onResetRow(p._id)}
                          disabled={!hasChanges(p._id) || isSaving}
                          className="rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-orange-50 disabled:opacity-50"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => onDelete(p._id)}
                          disabled={isSaving}
                          className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                      {errorMsg && (
                        <p className="mt-1 text-xs text-red-600">{errorMsg}</p>
                      )}
                      {hasChanges(p._id) && !errorMsg && (
                        <p className="mt-1 text-xs text-orange-600">
                          Unsaved changes
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Bar (server-driven) */}
            <div className="flex flex-col gap-3 border-t bg-white/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-neutral-600">
                Showing <span className="font-medium">{windowStart}</span>–
                <span className="font-medium">{windowEnd}</span> of{" "}
                <span className="font-medium">{totalItems}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="mx-2 text-sm text-neutral-600">
                  Page <span className="font-medium">{page}</span> /{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={gotoFirst}
                    disabled={!canPrev}
                    className="rounded border px-2 py-1 text-sm hover:bg-orange-50 disabled:opacity-40"
                    aria-label="First page"
                  >
                    «
                  </button>
                  <button
                    onClick={gotoPrev}
                    disabled={!canPrev}
                    className="rounded border px-2 py-1 text-sm hover:bg-orange-50 disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  <button
                    onClick={gotoNext}
                    disabled={!canNext}
                    className="rounded border px-2 py-1 text-sm hover:bg-orange-50 disabled:opacity-40"
                    aria-label="Next page"
                  >
                    ›
                  </button>
                  <button
                    onClick={gotoLast}
                    disabled={!canNext}
                    className="rounded border px-2 py-1 text-sm hover:bg-orange-50 disabled:opacity-40"
                    aria-label="Last page"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <p className="mt-3 text-xs text-neutral-400">
          Tip: Category and page size refetch from the server.
        </p>
      </section>
    </main>
  );
}
