import * as authService from "./auth.service.js";

export const registerCompany = async (req, res, next) => {
    try {

        const result = await authService.registerCompany(req.body);

        if (!result.success) {
            return res.status(409).json(result);
        }
        return res.status(201).json(result);

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const verifyOTP = async (req, res) => {

    const result = await authService.verifyOTP(req.body);

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};


