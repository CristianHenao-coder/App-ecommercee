import axios from "axios";

const API_URL = "/api";

export const profileService = {
    getProfile: async (email?: string) => {
        const headers: Record<string, string> = {};
        if (email) {
            headers["x-user-email"] = email;
        }
        const response = await axios.get(`${API_URL}/profile`, { headers });
        return response.data;
    },
    updateProfile: async (data: { email: string; name?: string; phone?: string; avatarUrl?: string }) => {
        const response = await axios.put(`${API_URL}/profile`, data);
        return response.data;
    },
    uploadAvatar: async (formData: FormData) => {
        const response = await axios.post(`${API_URL}/profile/avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
