import * as invitationService from "./invitation.service.js";

export const createInvitation = async (req, res, next) => {
    try {
        const result = await invitationService.createInvitation(
            req.user,
            req.body
        );

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);

    } catch (error) {
        next(error);
    }
};