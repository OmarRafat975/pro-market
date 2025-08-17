export function formatCurrency(n: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(n);
}

export function formatDateISO(iso: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso)
  );
}

export function itemsLine(
  items: { productId: { name: string }; quantity: number }[]
) {
  return items.map((it) => `${it.productId.name} × ${it.quantity}`).join(" - ");
}
