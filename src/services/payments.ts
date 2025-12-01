import axios from "axios";

const API_URL = "/api";

export const paymentService = {
    createOrder: async (cart: any[]) => {
        const response = await axios.post(`${API_URL}/paypal/create-order`, { cart });
        return response.data;
    },
    captureOrder: async (orderID: string, email: string, items: Array<{ productId: string; quantity: number; price: number }>) => {
        const response = await axios.post(`${API_URL}/paypal/capture-order`, {
            orderID,
            email,
            items,
        });
        return response.data;
    },
};
