import axios from "axios";
import { Product } from "@/interfaces/interfaces";

const API_URL = "/api";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },
  create: async (productData: FormData | any, email?: string) => {
    const headers: Record<string, string> = {};
    if (email) {
      headers["x-user-email"] = email;
    }
    
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: productData instanceof FormData ? { ...headers, "Content-Type": "multipart/form-data" } : { ...headers, "Content-Type": "application/json" },
    });
    return response.data;
  },
  update: async (id: string, productData: FormData | any, email?: string) => {
    const headers: Record<string, string> = {};
    if (email) {
      headers["x-user-email"] = email;
    }
    
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
      headers: productData instanceof FormData ? { ...headers, "Content-Type": "multipart/form-data" } : { ...headers, "Content-Type": "application/json" },
    });
    return response.data;
  },
  delete: async (id: string, email?: string) => {
    const headers: Record<string, string> = {};
    if (email) {
      headers["x-user-email"] = email;
    }
    
    const response = await axios.delete(`${API_URL}/products/${id}`, { headers });
    return response.data;
  },
};
