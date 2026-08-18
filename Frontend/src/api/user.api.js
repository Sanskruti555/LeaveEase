import apiClient from "./axios";

export const userApi = {
    getUsers: (params = {}) => apiClient.get("/users", { params }),
    getUserById: (id) => apiClient.get(`/users/${id}`),
    updateUserStatus: (id, status) => apiClient.patch(`/users/${id}/status`, { status })
};
