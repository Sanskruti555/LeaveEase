import apiClient from "./axios";

export const leaveTypeApi = {
    getLeaveTypes: () => apiClient.get("/leave-types"),
    createLeaveType: (data) => apiClient.post("/leave-types", data),
    updateLeaveType: (id, data) => apiClient.patch(`/leave-types/${id}`, data),
    updateLeaveTypeStatus: (id, status) => apiClient.patch(`/leave-types/${id}/status`, { status })
};
