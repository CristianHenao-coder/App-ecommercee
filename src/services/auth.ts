import axios from "axios";

const API_URL = "/api";

export const authService = {
    login: async (credentials: any) => {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    },
    register: async (userData: any) => {
        const response = await axios.post(`${API_URL}/user`, userData);
        return response.data;
    },
};
