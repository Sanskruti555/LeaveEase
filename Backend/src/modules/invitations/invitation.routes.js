import express from "express";

import {createInvitation} from "./invitation.controller.js";

import {authMiddleware} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post( "/", authMiddleware, createInvitation);

export default router;