import api, { normalizeAxiosError } from "@/lib/axios";
import {
  CreateProduct,
  GetProducts,
  Product,
  UpdateProduct,
} from "@/types/product";

export const getProducts = async (
  page = 1,
  limit = 10,
  category = ""
): Promise<GetProducts> => {
  const res = await api.get(
    `/products?page=${page}&limit=${limit}${
      category ? `&category=${category}` : ""
    }`
  );
  const data: GetProducts = res.data;

  return data;
};

export const createProduct = async (product: CreateProduct) => {
  try {
    const res = await api.post("/products", product);
    const data = res.data;

    return data;
  } catch (error) {
    throw normalizeAxiosError(error, "Faild to create Product");
  }
};

export const updateProduct = async (id: string, product: UpdateProduct) => {
  try {
    const res = await api.patch(`/products/${id}`, product);
    const data = res.data;

    return data;
  } catch (error) {
    throw normalizeAxiosError(error, "Faild to update Product");
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await api.delete(`/products/${id}`);
    const data = res.data;

    return data;
  } catch (error) {
    throw normalizeAxiosError(error, "Faild to delete Product");
  }
};
