import apiClient from "./axios";

export const authApi = {
    registerCompany: (data) => apiClient.post("/auth/register-company", data),
    verifyOTP: (data) => apiClient.post("/auth/verify-otp", data),
    resendOTP: (data) => apiClient.post("/auth/resend-otp", data),
    login: (data) => apiClient.post("/auth/login", data),
    logout: () => apiClient.post("/auth/logout"),
    forgotPassword: (data) => apiClient.post("/auth/forgot-password", data),
    resetPassword: (data) => apiClient.post("/auth/reset-password", data),
    changePassword: (data) => apiClient.post("/auth/change-password", data),
    getProfile: () => apiClient.get("/auth/profile"),
    updateProfile: (data) => apiClient.put("/auth/profile", data)
};
