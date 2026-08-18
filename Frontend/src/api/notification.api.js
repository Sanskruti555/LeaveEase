import apiClient from "./axios";

export const notificationApi = {
    getNotifications: () => apiClient.get("/notifications"),
    markNotificationAsRead: (notificationId) => apiClient.patch(`/notifications/${notificationId}/read`)
};
