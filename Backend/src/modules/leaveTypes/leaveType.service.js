import * as leaveTypeRepository from "./leaveType.repository.js";

export const createLeaveType = async (
    user,
    data
) => {

    try {

        const {
            company_id,
            role
        } = user;

        const {
            name,
            description,
            leave_allocation,
            allocation_frequency
        } = data;


        // Only Super Admin can create leave types
        if (role !== "SUPER_ADMIN") {
            return {
                success: false,
                message: "Only Super Admin can create leave types."
            };
        }


        // Check duplicate leave type
        const existingLeaveType =
            await leaveTypeRepository.findLeaveTypeByName(
                company_id,
                name
            );

        if (existingLeaveType) {
            return {
                success: false,
                message: "Leave type already exists."
            };
        }


        // Allocation must be positive
        if (leave_allocation <= 0) {
            return {
                success: false,
                message: "Leave allocation must be greater than zero."
            };
        }


        // Allowed allocation frequencies
        const allowedFrequencies = [
            "MONTHLY",
            "QUARTERLY",
            "HALF_YEARLY",
            "YEARLY",
            "ONCE"
        ];

        if (
            !allowedFrequencies.includes(
                allocation_frequency
            )
        ) {
            return {
                success: false,
                message: "Invalid allocation frequency."
            };
        }


        // Create leave type
        const leaveTypeId =
            await leaveTypeRepository.createLeaveType({
                company_id,
                name,
                description,
                leave_allocation,
                allocation_frequency,
                status: "ACTIVE"
            });


        return {
            success: true,
            message: "Leave type created successfully.",
            data: {
                leave_type_id: leaveTypeId
            }
        };

    } catch (error) {

        console.error(
            "Create Leave Type Error:",
            error
        );

        return {
            success: false,
            message: "Failed to create leave type."
        };
    }
};