import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import {
    createBranch,
    getBranches,
     getBranchById,
     updateBranch,
     updateBranchStatus
} from "./branch.controller.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createBranch
);

router.get(
    "/",
    authMiddleware,
    getBranches
);

router.get(
    "/:id",
    authMiddleware,
    getBranchById
);

router.patch(
    "/:id",
    authMiddleware,
    updateBranch
);

router.patch(
    "/:id/status",
    authMiddleware,
    updateBranchStatus
);



export default router;