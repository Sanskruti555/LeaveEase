import apiClient from "./axios";

export const dashboardApi = {
    getSuperAdminDashboard: () => apiClient.get("/dashboard/super-admin"),
    getBranchAdminDashboard: () => apiClient.get("/dashboard/branch-admin"),
    getManagerDashboard: () => apiClient.get("/dashboard/manager"),
    getEmployeeDashboard: () => apiClient.get("/dashboard/employee")
};
