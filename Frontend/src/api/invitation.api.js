import apiClient from "./axios";

export const invitationApi = {
    createInvitation: (data) => apiClient.post("/invitations", data),
    getInvitationByToken: (token) => apiClient.get(`/invitations/${token}`),
    acceptInvitation: (token, data) => apiClient.post(`/invitations/${token}/accept`, data),
    resendInvitation: (invitationId) => apiClient.post(`/invitations/${invitationId}/resend`),
    cancelInvitation: (invitationId) => apiClient.post(`/invitations/${invitationId}/cancel`)
};
