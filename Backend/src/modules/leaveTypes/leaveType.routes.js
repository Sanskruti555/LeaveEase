import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import {
    createLeaveType,
    getLeaveTypes,
    updateLeaveType,
    updateLeaveTypeStatus
} from "./leaveType.controller.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createLeaveType
);

router.get(
    "/",
    authMiddleware,
    getLeaveTypes
);

router.patch(
    "/:id",
    authMiddleware,
    updateLeaveType
);

router.patch(
    "/:id/status",
    authMiddleware,
    updateLeaveTypeStatus
);

export default router;