import express from "express";

import {createInvitation,  getInvitationByToken , acceptInvitation ,
    resendInvitation, cancelInvitation} from "./invitation.controller.js";

import {authMiddleware} from "../../middleware/auth.middleware.js";
import {
    validateAcceptInvitation
} from "./invitation.validation.js";

const router = express.Router();
//Create invitation
router.post( "/", authMiddleware, createInvitation);

//Validate invitation by token
router.get("/:token", getInvitationByToken);

//Accept invitation by token
router.post(
    "/:token/accept",
    validateAcceptInvitation,
    acceptInvitation
);

//Resend invitation by invitationId
router.post(
    "/:invitationId/resend",
    authMiddleware,
    resendInvitation
);

//Cancel invitation by invitationId
router.post(
    "/:invitationId/cancel",
    authMiddleware,
    cancelInvitation
);

export default router;