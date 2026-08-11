import * as dashboardRepository
    from "./dashboard.repository.js";


export const getSuperAdminDashboard = async (user) => {

    try {

        const {
            company_id,
            role
        } = user;


        if (role !== "SUPER_ADMIN") {
            return {
                success: false,
                message:
                    "Only Super Admin can access this dashboard."
            };
        }


        const [
            branchStats,
            userStats,
            leaveStats,
            leaveTypeStats,
            invitationStats
        ] = await Promise.all([

            dashboardRepository.getBranchStats(
                company_id
            ),

            dashboardRepository.getUserStats(
                company_id
            ),

            dashboardRepository.getLeaveStats(
                company_id
            ),

            dashboardRepository.getLeaveTypeStats(
                company_id
            ),

            dashboardRepository.getInvitationStats(
                company_id
            )

        ]);


        return {
            success: true,

            data: {

                branches: branchStats,

                users: userStats,

                leaves: leaveStats,

                leave_types: leaveTypeStats,

                invitations: invitationStats

            }
        };


    } catch (error) {

        console.error(
            "Super Admin Dashboard Error:",
            error
        );

        return {
            success: false,
            message:
                "Failed to fetch dashboard data."
        };
    }
};

export const getBranchAdminDashboard = async (user) => {

    try {

        const {
            company_id,
            branch_id,
            role
        } = user;


        if (role !== "BRANCH_ADMIN") {
            return {
                success: false,
                message:
                    "Only Branch Admin can access this dashboard."
            };
        }


        if (!branch_id) {
            return {
                success: false,
                message:
                    "Branch Admin is not assigned to a branch."
            };
        }


        const [
            userStats,
            leaveStats,
            leaveTypeStats,
            invitationStats
        ] = await Promise.all([

            dashboardRepository.getBranchUserStats(
                company_id,
                branch_id
            ),

            dashboardRepository.getBranchLeaveStats(
                company_id,
                branch_id
            ),

            dashboardRepository.getBranchLeaveTypeStats(
                company_id
            ),

            dashboardRepository.getBranchInvitationStats(
                company_id,
                branch_id
            )

        ]);


        return {
            success: true,
            data: {
                users: userStats,
                leaves: leaveStats,
                leave_types: leaveTypeStats,
                invitations: invitationStats
            }
        };


    } catch (error) {

        console.error(
            "Branch Admin Dashboard Error:",
            error
        );

        return {
            success: false,
            message:
                "Failed to fetch Branch Admin dashboard."
        };
    }
};

export const getManagerDashboard = async (user) => {

    try {

        const {
            user_id,
            company_id,
            branch_id,
            role
        } = user;

        if (role !== "MANAGER") {
            return {
                success: false,
                message:
                    "Only Manager can access this dashboard."
            };
        }

        if (!branch_id) {
            return {
                success: false,
                message:
                    "Manager is not assigned to a branch."
            };
        }

        const [
            userStats,
            leaveStats,
            leaveBalances
        ] = await Promise.all([

            dashboardRepository.getManagerUserStats(
                company_id,
                branch_id,
                user_id
            ),

            dashboardRepository.getManagerLeaveStats(
                company_id,
                branch_id,
                user_id
            ),

            dashboardRepository.getManagerLeaveBalances(
                company_id,
                branch_id,
                user_id
            )

        ]);

        return {
            success: true,

            data: {
                users: userStats,
                leaves: leaveStats,
                leave_balances: leaveBalances
            }
        };

    } catch (error) {

        console.error(
            "Manager Dashboard Error:",
            error
        );

        return {
            success: false,
            message:
                "Failed to fetch Manager dashboard."
        };
    }
};

export const getEmployeeDashboard = async (user) => {

    try {

        const {
            user_id,
            role
        } = user;

        if (role !== "EMPLOYEE") {
            return {
                success: false,
                message:
                    "Only Employee can access this dashboard."
            };
        }

        const [
         leaveBalances,
         leaveStats,
         recentLeaves
         ] = await Promise.all([

         dashboardRepository.getEmployeeLeaveBalances(
           user_id
         ),

        dashboardRepository.getEmployeeLeaveStats(
          user_id
       ),
       dashboardRepository.getEmployeeRecentLeaves(
        user_id
    )

]);



       return {
    success: true,
    data: {
        leave_balances: leaveBalances,
        leaves: leaveStats,
        recent_leaves: recentLeaves
    }
};

    } catch (error) {

        console.error(
            "Employee Dashboard Error:",
            error
        );

        return {
            success: false,
            message:
                "Failed to fetch Employee dashboard."
        };
    }
};

