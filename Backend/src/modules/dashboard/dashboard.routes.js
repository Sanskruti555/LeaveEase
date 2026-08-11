import express from "express";

import {
    getSuperAdminDashboard,
    getBranchAdminDashboard,
    getManagerDashboard,
    getEmployeeDashboard
} from "./dashboard.controller.js";

import {
    authMiddleware
} from "../../middleware/auth.middleware.js";


const router = express.Router();


router.get(
    "/super-admin",
    authMiddleware,
    getSuperAdminDashboard
);


router.get(
    "/branch-admin",
    authMiddleware,
    getBranchAdminDashboard
);

router.get(
    "/manager",
    authMiddleware,
    getManagerDashboard
);

router.get(
    "/employee",
    authMiddleware,
    getEmployeeDashboard
);

export default router;