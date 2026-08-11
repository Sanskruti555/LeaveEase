import * as usersService from "./users.service.js";

export const getUsers = async (req, res, next) => {

    try {

        const result =
            await usersService.getUsers(
                req.user,
                req.query
            );

        return res.status(
            result.success ? 200 : 403
        ).json(result);

    } catch (error) {

        next(error);
    }
};

export const getUserById = async (req, res, next) => {

    try {

        const result =
            await usersService.getUserById(
                req.user,
                req.params.id
            );

        return res.status(
            result.success ? 200 : 403
        ).json(result);

    } catch (error) {

        next(error);
    }
};

export const updateUserStatus = async (req, res, next) => {

    try {

        const result =
            await usersService.updateUserStatus(
                req.user,
                req.params.id,
                req.body.status
            );

        return res.status(
            result.success ? 200 : 403
        ).json(result);

    } catch (error) {

        next(error);
    }
};