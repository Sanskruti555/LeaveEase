import express from "express";

import {
    applyLeave , getMyLeaves ,   getTeamLeaves ,  rejectLeave , approveLeave
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

export default router;