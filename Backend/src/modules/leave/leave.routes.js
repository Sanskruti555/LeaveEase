import express from "express";
import upload from "../../middleware/upload.middleware.js";

import {
    applyLeave , getMyLeaves ,   getTeamLeaves ,  rejectLeave , approveLeave ,getLeaveBalances ,cancelLeave
} from "./leave.controller.js";

import {
    validateApplyLeave,  validateRejectLeave
} from "./leave.validation.js";

import {
    authMiddleware
} from "../../middleware/auth.middleware.js";


const router = express.Router();


router.post(
    "/",
    authMiddleware,
    validateApplyLeave,
    upload.single("attachment"),
    applyLeave
);

router.get(
    "/my",
    authMiddleware,
    getMyLeaves
);

router.get(
    "/team",
    authMiddleware,
    getTeamLeaves
);

router.patch(
    "/:requestId/approve",
    authMiddleware,
    approveLeave
);

router.patch(
    "/:requestId/reject",
    authMiddleware,
    validateRejectLeave,
    rejectLeave
);

router.get(
    "/balances",
    authMiddleware,
    getLeaveBalances
);

router.patch(
    "/:requestId/cancel",
    authMiddleware,
    cancelLeave
);

export default router;