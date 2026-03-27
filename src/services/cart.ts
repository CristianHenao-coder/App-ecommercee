import axios from "axios";

const API_URL = "/api";

export const cartService = {
    getCart: async (email: string) => {
        const response = await axios.get(`${API_URL}/cart?email=${encodeURIComponent(email)}`);
        return response.data.cart || [];
    },
    syncCart: async (email: string, cart: Array<{ productId: string; quantity: number }>) => {
        const response = await axios.put(`${API_URL}/cart`, { email, items: cart });
        return response.data;
    },
};
    