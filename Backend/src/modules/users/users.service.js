import * as usersRepository from "./users.repository.js";

export const getUsers = async (user, query) => {

    try {

        const {
            user_id,
            company_id,
            branch_id,
            role
        } = user;

        let {
            page = 1,
            limit = 10,
            role: filterRole,
            branch_id: filterBranchId,
            manager_id: filterManagerId,
            status,
            search
        } = query;


        // Convert pagination values
        page = Number(page);
        limit = Number(limit);


        // Pagination validation
        if (!Number.isInteger(page) || page < 1) {
            return {
                success: false,
                message: "Page must be a positive integer."
            };
        }

        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return {
                success: false,
                message:
                    "Limit must be between 1 and 100."
            };
        }


        const offset = (page - 1) * limit;


        // Validate role filter
        const allowedRoles = [
            "SUPER_ADMIN",
            "BRANCH_ADMIN",
            "MANAGER",
            "EMPLOYEE"
        ];

        if (
            filterRole &&
            !allowedRoles.includes(filterRole)
        ) {
            return {
                success: false,
                message: "Invalid role filter."
            };
        }


        // Validate status filter
        const allowedStatuses = [
            "ACTIVE",
            "INACTIVE"
        ];

        if (
            status &&
            !allowedStatuses.includes(status)
        ) {
            return {
                success: false,
                message: "Invalid status filter."
            };
        }


        /*
         * --------------------------------
         * ROLE-BASED DATA SCOPE
         * --------------------------------
         */

        let filters = {
            role: filterRole,
            branchId: filterBranchId,
            managerId: filterManagerId,
            status,
            search,
            limit,
            offset
        };


        // SUPER_ADMIN
        // Can view users across the company
        if (role === "SUPER_ADMIN") {

            // No additional restriction
        }


        // BRANCH_ADMIN
        // Can only view users in own branch
        else if (role === "BRANCH_ADMIN") {

            if (!branch_id) {
                return {
                    success: false,
                    message:
                        "Branch Admin is not assigned to a branch."
                };
            }

            filters.branchId = branch_id;
        }


        // MANAGER
        // Can only view own employees
        else if (role === "MANAGER") {

            filters.managerId = user_id;

            // Manager should only see employees
            filters.role = "EMPLOYEE";
        }


        // EMPLOYEE
        else if (role === "EMPLOYEE") {

            return {
                success: false,
                message:
                    "Employees are not allowed to view users."
            };
        }


        else {

            return {
                success: false,
                message: "Invalid user role."
            };
        }


        // Fetch paginated users + total count
        const [
            users,
            total
        ] = await Promise.all([

            usersRepository.findUsersByCompany(
                company_id,
                filters
            ),

            usersRepository.countUsersByCompany(
                company_id,
                filters
            )

        ]);


        const totalPages =
            Math.ceil(total / limit);


        return {
            success: true,

            data: {
                users,

                pagination: {
                    page,
                    limit,
                    total,
                    total_pages: totalPages
                }
            }
        };


    } catch (error) {

        console.error(
            "Get Users Error:",
            error
        );

        return {
            success: false,
            message:
                "Failed to fetch users."
        };
    }
};

export const getUserById = async (user, targetUserId) => {

    try {

        const {
            user_id,
            company_id,
            branch_id,
            role
        } = user;


        // Validate user ID
        const targetId = Number(targetUserId);

        if (!Number.isInteger(targetId) || targetId < 1) {
            return {
                success: false,
                message: "Invalid user ID."
            };
        }


        /*
         * --------------------------------
         * EMPLOYEE
         * --------------------------------
         */

        if (role === "EMPLOYEE") {
            return {
                success: false,
                message:
                    "Employees are not allowed to view users."
            };
        }


        /*
         * --------------------------------
         * Fetch target user
         * --------------------------------
         */

        const targetUser =
            await usersRepository.findUserById(
                targetId,
                company_id
            );


        if (!targetUser) {
            return {
                success: false,
                message: "User not found."
            };
        }


        /*
         * --------------------------------
         * SUPER ADMIN
         * --------------------------------
         *
         * Can view any user inside
         * their own company.
         */

        if (role === "SUPER_ADMIN") {

            return {
                success: true,
                data: targetUser
            };
        }


        /*
         * --------------------------------
         * BRANCH ADMIN
         * --------------------------------
         *
         * Can only view users belonging
         * to their own branch.
         */

        if (role === "BRANCH_ADMIN") {

            if (!branch_id) {
                return {
                    success: false,
                    message:
                        "Branch Admin is not assigned to a branch."
                };
            }

            if (
                targetUser.branch_id !== branch_id
            ) {
                return {
                    success: false,
                    message:
                        "You are not allowed to view this user."
                };
            }

            return {
                success: true,
                data: targetUser
            };
        }


        /*
         * --------------------------------
         * MANAGER
         * --------------------------------
         *
         * Manager can only view their
         * own employees.
         */

        if (role === "MANAGER") {

            if (
                targetUser.role !== "EMPLOYEE" ||
                targetUser.manager_id !== user_id
            ) {
                return {
                    success: false,
                    message:
                        "You are not allowed to view this user."
                };
            }

            return {
                success: true,
                data: targetUser
            };
        }


        return {
            success: false,
            message: "Invalid user role."
        };


    } catch (error) {

        console.error(
            "Get User By ID Error:",
            error
        );

        return {
            success: false,
            message:
                "Failed to fetch user."
        };
    }
};

export const updateUserStatus = async (
    user,
    targetUserId,
    status
) => {

    try {

        const {
            user_id,
            company_id,
            branch_id,
            role
        } = user;

        const targetId = Number(targetUserId);

        // Validate user ID
        if (!Number.isInteger(targetId) || targetId < 1) {
            return {
                success: false,
                message: "Invalid user ID."
            };
        }

        // Validate status
        const allowedStatuses = [
            "ACTIVE",
            "INACTIVE"
        ];

        if (!allowedStatuses.includes(status)) {
            return {
                success: false,
                message: "Invalid user status."
            };
        }

        // Employees cannot change user status
        if (role === "EMPLOYEE") {
            return {
                success: false,
                message:
                    "Employees are not allowed to change user status."
            };
        }

        // Find target user inside same company
        const targetUser =
            await usersRepository.findUserById(
                targetId,
                company_id
            );

        if (!targetUser) {
            return {
                success: false,
                message: "User not found."
            };
        }

        /*
         * SUPER ADMIN
         * Can change users in own company.
         */
        if (role === "SUPER_ADMIN") {

            const updated =
                await usersRepository.updateUserStatus(
                    targetId,
                    company_id,
                    status
                );

            if (!updated) {
                return {
                    success: false,
                    message: "Failed to update user status."
                };
            }

            return {
                success: true,
                message:
                    `User ${status.toLowerCase()} successfully.`
            };
        }

        /*
         * BRANCH ADMIN
         * Can change users only in own branch.
         */
        if (role === "BRANCH_ADMIN") {

            if (!branch_id) {
                return {
                    success: false,
                    message:
                        "Branch Admin is not assigned to a branch."
                };
            }

            if (targetUser.branch_id !== branch_id) {
                return {
                    success: false,
                    message:
                        "You are not allowed to change this user's status."
                };
            }

            const updated =
                await usersRepository.updateUserStatus(
                    targetId,
                    company_id,
                    status
                );

            if (!updated) {
                return {
                    success: false,
                    message: "Failed to update user status."
                };
            }

            return {
                success: true,
                message:
                    `User ${status.toLowerCase()} successfully.`
            };
        }

        /*
         * MANAGER
         * Can change status only for own employees.
         */
        if (role === "MANAGER") {

            if (
                targetUser.role !== "EMPLOYEE" ||
                targetUser.manager_id !== user_id
            ) {
                return {
                    success: false,
                    message:
                        "You are not allowed to change this user's status."
                };
            }

            const updated =
                await usersRepository.updateUserStatus(
                    targetId,
                    company_id,
                    status
                );

            if (!updated) {
                return {
                    success: false,
                    message: "Failed to update user status."
                };
            }

            return {
                success: true,
                message:
                    `User ${status.toLowerCase()} successfully.`
            };
        }

        return {
            success: false,
            message: "Invalid user role."
        };

    } catch (error) {

        console.error(
            "Update User Status Error:",
            error
        );

        return {
            success: false,
            message: "Failed to update user status."
        };
    }
};