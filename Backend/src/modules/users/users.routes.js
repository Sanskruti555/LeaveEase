import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
    getUsers,
    getUserById,
     updateUserStatus
} from "./users.controller.js";



const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getUsers
);

router.get(
    "/:id",
    authMiddleware,
    getUserById
);


router.patch(
    "/:id/status",
    authMiddleware,
    updateUserStatus
);

export default router;