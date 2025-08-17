export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
};

export type GetProducts = {
  products: Product[];
  total: number;
  pages: number;
  allCategories: string[];
};

export type CreateProduct = {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
};

export type UpdateProduct =
  | {
      name: string;
      description?: string;
      price?: number;
      category?: string;
      image?: string;
      stock?: number;
    }
  | {};
