import * as branchRepository from "./branch.repository.js";

export const createBranch = async (user, data) => {

    try {

        const {
            company_id,
            role
        } = user;

        const {
            name,
            email,
            phone,
            address,
            city,
            state,
            country
        } = data;


        // Only Super Admin can create branches
        if (role !== "SUPER_ADMIN") {
            return {
                success: false,
                message: "Only Super Admin can create branches."
            };
        }


        // Required fields
        if (
            !name ||
            !email ||
            !city ||
            !state ||
            !country
        ) {
            return {
                success: false,
                message:
                    "Name, email, city, state and country are required."
            };
        }


        // Create branch
        const branchId =
            await branchRepository.createBranch({
                company_id,
                name: name.trim(),
                email: email.trim(),
                phone: phone?.trim() || null,
                address: address?.trim() || null,
                city: city.trim(),
                state: state.trim(),
                country: country.trim()
            });


        return {
            success: true,
            message: "Branch created successfully.",
            data: {
                branch_id: branchId
            }
        };


    } catch (error) {

        console.error(
            "Create Branch Error:",
            error
        );


        // Duplicate branch name/email
        if (error.code === "ER_DUP_ENTRY") {
            return {
                success: false,
                message:
                    "A branch with this name or email already exists."
            };
        }


        return {
            success: false,
            message: "Failed to create branch."
        };
    }
};

export const getBranches = async (user) => {

    try {

        const {
            company_id,
            role
        } = user;


        // Only Super Admin can view all company branches
        if (role !== "SUPER_ADMIN") {
            return {
                success: false,
                message: "Only Super Admin can view branches."
            };
        }


        const branches =
            await branchRepository.getBranches(
                company_id
            );


        return {
            success: true,
            data: branches
        };


    } catch (error) {

        console.error(
            "Get Branches Error:",
            error
        );

        return {
            success: false,
            message: "Failed to fetch branches."
        };
    }
};

export const getBranchById = async (
    user,
    branchId
) => {

    try {

        const {
            company_id,
            role
        } = user;

        if (role !== "SUPER_ADMIN") {
            return {
                success: false,
                message: "Only Super Admin can view branch details."
            };
        }

        const branch =
            await branchRepository.getBranchById(
                branchId,
                company_id
            );

        if (!branch) {
            return {
                success: false,
                message: "Branch not found."
            };
        }

        return {
            success: true,
            data: branch
        };

    } catch (error) {

        console.error(
            "Get Branch By ID Error:",
            error
        );

        return {
            success: false,
            message: "Failed to fetch branch."
        };
    }
};

export const updateBranch = async (
    user,
    branchId,
    data
) => {

    try {

        const {
            company_id,
            role
        } = user;

        const {
            name,
            email,
            phone,
            address,
            city,
            state,
            country
        } = data;


        // Only Super Admin can update branches
        if (role !== "SUPER_ADMIN") {
            return {
                success: false,
                message: "Only Super Admin can update branches."
            };
        }


        // Check branch exists in this company
        const existingBranch =
            await branchRepository.getBranchById(
                branchId,
                company_id
            );

        if (!existingBranch) {
            return {
                success: false,
                message: "Branch not found."
            };
        }


        // Required fields
        if (
            !name ||
            !email ||
            !city ||
            !state ||
            !country
        ) {
            return {
                success: false,
                message:
                    "Name, email, city, state and country are required."
            };
        }


        const updated =
            await branchRepository.updateBranch(
                branchId,
                company_id,
                {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone?.trim() || null,
                    address: address?.trim() || null,
                    city: city.trim(),
                    state: state.trim(),
                    country: country.trim()
                }
            );


        if (!updated) {
            return {
                success: false,
                message: "Failed to update branch."
            };
        }


        return {
            success: true,
            message: "Branch updated successfully."
        };


    } catch (error) {

        console.error(
            "Update Branch Error:",
            error
        );


        if (error.code === "ER_DUP_ENTRY") {
            return {
                success: false,
                message:
                    "A branch with this name or email already exists."
            };
        }


        return {
            success: false,
            message: "Failed to update branch."
        };
    }
};

export const updateBranchStatus = async (
    user,
    branchId,
    status
) => {

    try {

        const {
            company_id,
            role
        } = user;


        // Only Super Admin can change branch status
        if (role !== "SUPER_ADMIN") {
            return {
                success: false,
                message:
                    "Only Super Admin can change branch status."
            };
        }


        const allowedStatuses = [
            "ACTIVE",
            "INACTIVE"
        ];

        if (!allowedStatuses.includes(status)) {
            return {
                success: false,
                message: "Invalid branch status."
            };
        }


        // Verify branch belongs to this company
        const existingBranch =
            await branchRepository.getBranchById(
                branchId,
                company_id
            );

        if (!existingBranch) {
            return {
                success: false,
                message: "Branch not found."
            };
        }


        const updated =
            await branchRepository.updateBranchStatus(
                branchId,
                company_id,
                status
            );


        if (!updated) {
            return {
                success: false,
                message:
                    "Failed to update branch status."
            };
        }


        return {
            success: true,
            message:
                `Branch ${status.toLowerCase()} successfully.`
        };


    } catch (error) {

        console.error(
            "Update Branch Status Error:",
            error
        );

        return {
            success: false,
            message:
                "Failed to update branch status."
        };
    }
};

