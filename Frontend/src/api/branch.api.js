import apiClient from "./axios";

export const branchApi = {
    getBranches: () => apiClient.get("/branches"),
    getBranchById: (id) => apiClient.get(`/branches/${id}`),
    createBranch: (data) => apiClient.post("/branches", data),
    updateBranch: (id, data) => apiClient.patch(`/branches/${id}`, data),
    updateBranchStatus: (id, status) => apiClient.patch(`/branches/${id}/status`, { status })
};
