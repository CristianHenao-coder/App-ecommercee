import axios from "axios";
import { Product } from "@/interfaces/interfaces";

export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get("/api/products");
  return res.data;
};