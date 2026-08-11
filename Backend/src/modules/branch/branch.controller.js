import * as branchService from "./branch.service.js";

export const createBranch = async (req, res) => {

    try {

        const result =
            await branchService.createBranch(
                req.user,
                req.body
            );

        return res.status(
            result.success ? 201 : 400
        ).json(result);

    } catch (error) {

        console.error(
            "Create Branch Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create branch."
        });
    }
};

export const getBranches = async (req, res) => {

    try {

        const result =
            await branchService.getBranches(
                req.user
            );

        return res.status(
            result.success ? 200 : 403
        ).json(result);

    } catch (error) {

        console.error(
            "Get Branches Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch branches."
        });
    }
};

export const getBranchById = async (req, res) => {

    try {

        const result =
            await branchService.getBranchById(
                req.user,
                req.params.id
            );

        return res.status(
            result.success ? 200 : 404
        ).json(result);

    } catch (error) {

        console.error(
            "Get Branch By ID Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch branch."
        });
    }
};

export const updateBranch = async (req, res) => {

    try {

        const result =
            await branchService.updateBranch(
                req.user,
                req.params.id,
                req.body
            );

        return res.status(
            result.success ? 200 : 400
        ).json(result);

    } catch (error) {

        console.error(
            "Update Branch Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update branch."
        });
    }
};

export const updateBranchStatus = async (
    req,
    res
) => {

    try {

        const result =
            await branchService.updateBranchStatus(
                req.user,
                req.params.id,
                req.body.status
            );

        return res.status(
            result.success ? 200 : 400
        ).json(result);

    } catch (error) {

        console.error(
            "Update Branch Status Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update branch status."
        });
    }
};

