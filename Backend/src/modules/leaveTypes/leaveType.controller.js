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