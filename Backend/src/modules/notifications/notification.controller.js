import * as notificationService from "./notification.service.js";

export const getNotifications = async (req, res) => {

    const result =
        await notificationService.getNotifications(
            req.user
        );

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};

export const markNotificationAsRead = async (req, res) => {

    const { notificationId } = req.params;

    const result =
        await notificationService.markNotificationAsRead(
            req.user,
            notificationId
        );

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(404).json(result);
};