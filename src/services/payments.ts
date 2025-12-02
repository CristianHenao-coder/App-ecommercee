import axios from "axios";

const API_URL = "/api";

export const paymentService = {
    createOrder: async (cart: Array<{ precio: number; quantity: number; [key: string]: unknown }>) => {
        try {
            const response = await axios.post(`${API_URL}/paypal/create-order`, { cart });
            if (!response.data || !response.data.id) {
                throw new Error("Invalid response from create-order endpoint");
            }
            return response.data;
        } catch (error) {
            console.error("Payment service error:", error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || error.message || "Failed to create order";
                throw new Error(message);
            }
            throw error;
        }
    },
    captureOrder: async (orderID: string, email: string, items: Array<{ productId: string; quantity: number; price: number }>) => {
        try {
            const response = await axios.post(`${API_URL}/paypal/capture-order`, {
                orderID,
                email,
                items,
            });
            return response.data;
        } catch (error) {
            console.error("Capture order error:", error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || error.message || "Failed to capture order";
                throw new Error(message);
            }
            throw error;
        }
    },
};
