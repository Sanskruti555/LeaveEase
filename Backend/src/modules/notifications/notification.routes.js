import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";


import {
    getNotifications,
    markNotificationAsRead
} from "./notification.controller.js";

const router = express.Router();



router.get(
    "/",
    authMiddleware,
    getNotifications
);

router.patch(
    "/:notificationId/read",
    authMiddleware,
    markNotificationAsRead
);

export default router;