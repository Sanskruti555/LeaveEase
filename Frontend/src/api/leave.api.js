import apiClient from "./axios";

export const leaveApi = {
    applyLeave: (formData) => {
        return apiClient.post("/leaves", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },
    getMyLeaves: () => apiClient.get("/leaves/my"),
    getTeamLeaves: () => apiClient.get("/leaves/team"),
    approveLeave: (requestId) => apiClient.patch(`/leaves/${requestId}/approve`),
    rejectLeave: (requestId, data) => apiClient.patch(`/leaves/${requestId}/reject`, data),
    getLeaveBalances: () => apiClient.get("/leaves/balances"),
    cancelLeave: (requestId) => apiClient.patch(`/leaves/${requestId}/cancel`)
};
