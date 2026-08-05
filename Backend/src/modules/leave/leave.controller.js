import * as leaveService from "./leave.service.js";


export const applyLeave = async (req, res) => {

    const result = await leaveService.applyLeave(
        req.user,
        req.body
    );

    if (result.success) {
        return res.status(201).json(result);
    }

    return res.status(400).json(result);
};

export const getMyLeaves = async (req, res) => {

    const result =
        await leaveService.getMyLeaves(req.user);

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};

export const getTeamLeaves = async (req, res) => {

    const result =
        await leaveService.getTeamLeaves(req.user);

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};
export const approveLeave = async (req, res) => {

    const { requestId } = req.params;

    const result = await leaveService.approveLeave(
        req.user,
        requestId
    );

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};


export const rejectLeave = async (req, res) => {

    const { requestId } = req.params;

    const result = await leaveService.rejectLeave(
        req.user,
        requestId,
        req.body
    );

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};