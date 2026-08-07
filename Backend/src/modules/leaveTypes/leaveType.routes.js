import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import {
    createLeaveType
} from "./leaveType.controller.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createLeaveType
);

export default router;