import axios from "axios";
import { Product } from "@/interfaces/interfaces";

export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get("/api/products");
  return res.data;
};

// Crear producto con imagen
export const createProduct = async (formData: FormData): Promise<Product> => {
  const res = await axios.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
