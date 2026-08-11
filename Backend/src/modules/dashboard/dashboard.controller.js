import * as dashboardService
    from "./dashboard.service.js";


export const getSuperAdminDashboard = async (
    req,
    res
) => {

    try {

        const result =
            await dashboardService
                .getSuperAdminDashboard(
                    req.user
                );


        return res.status(
            result.success ? 200 : 403
        ).json(result);


    } catch (error) {

        console.error(
            "Super Admin Dashboard Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch dashboard data."
        });
    }
};

export const getBranchAdminDashboard = async (
    req,
    res
) => {

    try {

        const result =
            await dashboardService
                .getBranchAdminDashboard(
                    req.user
                );

        return res.status(
            result.success ? 200 : 403
        ).json(result);

    } catch (error) {

        console.error(
            "Branch Admin Dashboard Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch Branch Admin dashboard."
        });
    }
};

export const getManagerDashboard = async (
    req,
    res
) => {

    try {

        const result =
            await dashboardService.getManagerDashboard(
                req.user
            );

        return res.status(
            result.success ? 200 : 403
        ).json(result);

    } catch (error) {

        console.error(
            "Manager Dashboard Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch Manager dashboard."
        });
    }
};

export const getEmployeeDashboard = async (req, res) => {

    try {

        const result =
            await dashboardService.getEmployeeDashboard(
                req.user
            );

        return res.status(
            result.success ? 200 : 403
        ).json(result);

    } catch (error) {

        console.error(
            "Employee Dashboard Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch Employee dashboard."
        });
    }
};