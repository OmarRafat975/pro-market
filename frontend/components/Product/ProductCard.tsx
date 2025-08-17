import Image from "next/image";
import AddCartButton from "./AddCartButton";
import { Product } from "@/types/product";
import { isValidImgUrl } from "@/lib/validation";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <article className="h-full flex flex-col rounded-lg border border-orange-100 bg-amber-50/40 shadow-sm transition hover:shadow-md">
      {/* Image area */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] bg-white">
        <Image
          src={isValidImgUrl(product.image)}
          alt={product.name}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-contain p-3"
        />
        {/* Badges overlay */}
        <div className="pointer-events-none absolute left-2 top-2 flex gap-2">
          <span className="rounded bg-orange-500/90 px-2 py-0.5 text-[11px] font-medium text-white">
            {product.category}
          </span>
        </div>
        <div className="absolute right-2 top-2">
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-medium text-white ${
              product.stock > 0 ? "bg-green-600/90" : "bg-orange-400/90"
            }`}
          >
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-900">
          {product.name}
        </h3>

        <p className="mb-3 line-clamp-2 text-sm text-gray-700">
          {product.description}
        </p>

        <div className="mb-3 flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray-900">
            ${product.price}
          </div>
          <div className="rounded bg-white px-2 py-1 text-xs text-gray-700 border">
            {product.stock} left
          </div>
        </div>

        {/* CTA sticks to bottom */}
        <div className="mt-auto">
          <AddCartButton product={product} />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
