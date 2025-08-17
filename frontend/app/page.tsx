import PaginationButtons from "@/components/UI/PaginationButtons";
import ProductCard from "@/components/Product/ProductCard";
import { Product } from "@/types/product";
import { getProducts } from "@/apis/products";
import CategorySelect from "@/components/Product/CategorySelect";
import SearchBar from "@/components/Product/SearchBar";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};

  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);
  const category = (params.category as string) ?? "";
  const search = (params.search as string) ?? "";

  let data;
  try {
    data = await getProducts(page, limit, category);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return (
      <section className="container mx-auto p-6">
        <p className="text-red-600 font-semibold text-center">
          Failed to load products. Please try again later.
        </p>
      </section>
    );
  }

  const filteredProducts = search
    ? data.products.filter((p: Product) =>
        (p.name + " " + p.description)
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : data.products;

  if (!filteredProducts.length) {
    return (
      <section className="container mx-auto p-6">
        <div className="my-4 flex flex-col sm:flex-row gap-2 justify-between">
          <CategorySelect
            categories={data.allCategories}
            page={page}
            limit={limit}
            search={search}
          />
          <SearchBar />
        </div>
        <p className="text-gray-600">No products found.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto">
      <div className="my-4 flex flex-col sm:flex-row gap-2 justify-between">
        <CategorySelect
          categories={data.allCategories}
          page={page}
          limit={limit}
          search={search}
        />
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-8">
        {filteredProducts.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="mt-4">
        <PaginationButtons
          category={category}
          search={search}
          totalPages={data.pages}
          products={filteredProducts}
        />
      </div>
    </section>
  );
}
