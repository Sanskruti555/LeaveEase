import * as notificationRepository from "./notification.repository.js";

export const getNotifications = async (user) => {

    try {

        const {
            user_id,
            company_id
        } = user;


        // Fetch only the logged-in user's
        // notifications from their company
        const notifications =
            await notificationRepository.findNotificationsByUser(
                user_id,
                company_id
            );


        return {
            success: true,
            data: notifications
        };

    } catch (error) {

        console.error(
            "Get Notifications Error:",
            error
        );

        return {
            success: false,
            message: "Failed to fetch notifications."
        };
    }
};

export const createNotification = async (data) => {

    try {

        const notificationId =
            await notificationRepository.createNotification(
                data
            );

        return {
            success: true,
            data: {
                notification_id: notificationId
            }
        };

    } catch (error) {

        console.error(
            "Create Notification Error:",
            error
        );

        return {
            success: false,
            message: "Failed to create notification."
        };
    }
};

export const markNotificationAsRead = async (
    user,
    notificationId
) => {

    try {

        const {
            user_id,
            company_id
        } = user;


        const updated =
            await notificationRepository.markNotificationAsRead(
                notificationId,
                user_id,
                company_id
            );


        if (!updated) {
            return {
                success: false,
                message: "Notification not found."
            };
        }


        return {
            success: true,
            message: "Notification marked as read."
        };


    } catch (error) {

        console.error(
            "Mark Notification As Read Error:",
            error
        );

        return {
            success: false,
            message: "Failed to mark notification as read."
        };
    }
};