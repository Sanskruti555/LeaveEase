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

export const getInvitationByToken = async (req, res, next) => {
    try {
        const { token } = req.params;

        const result =
            await invitationService.getInvitationByToken(token);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

export const acceptInvitation = async (req, res, next) => {
    try {

        const { token } = req.params;

        const result =
            await invitationService.acceptInvitation(
                token,
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

export const resendInvitation = async (req, res, next) => {
    try {
        const { invitationId } = req.params;

        const result =
            await invitationService.resendInvitation(
                req.user,
                invitationId
            );

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

export const cancelInvitation = async (req, res, next) => {
    try {
        const { invitationId } = req.params;

        const result =
            await invitationService.cancelInvitation(
                req.user,
                invitationId
            );

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};
