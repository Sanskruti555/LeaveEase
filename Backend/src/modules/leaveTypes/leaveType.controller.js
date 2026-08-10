import * as leaveTypeService from "./leaveType.service.js";

export const createLeaveType = async (req, res) => {

    const result =
        await leaveTypeService.createLeaveType(
            req.user,
            req.body
        );

    if (result.success) {
        return res.status(201).json(result);
    }

    return res.status(400).json(result);
};

export const getLeaveTypes = async (req, res) => {

    const result =
        await leaveTypeService.getLeaveTypes(
            req.user
        );

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};

export const updateLeaveType = async (req, res) => {

    const { id } = req.params;

    const result =
        await leaveTypeService.updateLeaveType(
            req.user,
            id,
            req.body
        );

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};

export const updateLeaveTypeStatus = async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const result =
        await leaveTypeService.updateLeaveTypeStatus(
            req.user,
            id,
            status
        );

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};