import * as leaveTypeRepository from "./leaveType.repository.js";
import * as auditLogService
    from "../auditLogs/auditLog.service.js";

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
            "ONE_TIME",
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

           const auditResult =
    await auditLogService.createAuditLog({
        company_id,
        user_id: user.user_id,
        action: "CREATE",
        entity_type: "LEAVE_TYPE",
        entity_id: leaveTypeId,

        old_value: null,

        new_value: {
            name,
            description,
            leave_allocation,
            allocation_frequency,
            status: "ACTIVE"
        },

        ip_address: null,
        user_agent: null
    });

if (!auditResult.success) {
    console.error(
        "Failed to create leave type audit log."
    );
} 


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

export const getLeaveTypes = async (user) => {

    try {

        const {
            company_id
        } = user;


        // Fetch leave types belonging to user's company
        const leaveTypes =
            await leaveTypeRepository.findLeaveTypesByCompany(
                company_id
            );


        return {
            success: true,
            data: leaveTypes
        };

    } catch (error) {

        console.error(
            "Get Leave Types Error:",
            error
        );

        return {
            success: false,
            message: "Failed to fetch leave types."
        };
    }
};

export const updateLeaveType = async (
    user,
    leaveTypeId,
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


        // Only Super Admin can update leave types
        if (role !== "SUPER_ADMIN") {
            return {
                success: false,
                message: "Only Super Admin can update leave types."
            };
        }


        // Find leave type and verify company ownership
        const existingLeaveType =
            await leaveTypeRepository.findLeaveTypeById(
                leaveTypeId,
                company_id
            );


        if (!existingLeaveType) {
            return {
                success: false,
                message: "Leave type not found."
            };
        }


        // Check duplicate name
        const duplicateLeaveType =
            await leaveTypeRepository.findLeaveTypeByName(
                company_id,
                name
            );


        if (
            duplicateLeaveType &&
            duplicateLeaveType.leave_type_id !==
                Number(leaveTypeId)
        ) {
            return {
                success: false,
                message: "Another leave type with this name already exists."
            };
        }


        // Validate allocation
        if (
            leave_allocation === undefined ||
            leave_allocation <= 0
        ) {
            return {
                success: false,
                message: "Leave allocation must be greater than zero."
            };
        }


        // Validate frequency
        const allowedFrequencies = [
            "MONTHLY",
            "QUARTERLY",
            "HALF_YEARLY",
            "YEARLY",
            "ONE_TIME",
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


        // Update leave type
        const updated =
            await leaveTypeRepository.updateLeaveType(
                leaveTypeId,
                company_id,
                {
                    name,
                    description,
                    leave_allocation,
                    allocation_frequency
                }
            );


        if (!updated) {
            return {
                success: false,
                message: "Failed to update leave type."
            };
        }


        const auditResult =
    await auditLogService.createAuditLog({
        company_id,
        user_id: user.user_id,
        action: "UPDATE",
        entity_type: "LEAVE_TYPE",
        entity_id: Number(leaveTypeId),

        old_value: {
            name: existingLeaveType.name,
            description: existingLeaveType.description,
            leave_allocation:
                existingLeaveType.leave_allocation,
            allocation_frequency:
                existingLeaveType.allocation_frequency
        },

        new_value: {
            name,
            description,
            leave_allocation,
            allocation_frequency
        },

        ip_address: null,
        user_agent: null
    });

if (!auditResult.success) {
    console.error(
        "Failed to create leave type update audit log."
    );
}

        return {
            success: true,
            message: "Leave type updated successfully."
        };


    } catch (error) {

        console.error(
            "Update Leave Type Error:",
            error
        );

        return {
            success: false,
            message: "Failed to update leave type."
        };
    }
};

export const updateLeaveTypeStatus = async (
    user,
    leaveTypeId,
    status
) => {

    try {

        const {
            company_id,
            role
        } = user;


        // Only Super Admin can change leave type status
        if (role !== "SUPER_ADMIN") {
            return {
                success: false,
                message: "Only Super Admin can change leave type status."
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
                message: "Invalid leave type status."
            };
        }


        // Verify leave type belongs to user's company
        const existingLeaveType =
            await leaveTypeRepository.findLeaveTypeById(
                leaveTypeId,
                company_id
            );


        if (!existingLeaveType) {
            return {
                success: false,
                message: "Leave type not found."
            };
        }


        // Update status
        const updated =
            await leaveTypeRepository.updateLeaveTypeStatus(
                leaveTypeId,
                company_id,
                status
            );


        if (!updated) {
            return {
                success: false,
                message: "Failed to update leave type status."
            };
        }

        const auditResult =
    await auditLogService.createAuditLog({
        company_id,
        user_id: user.user_id,
        action: "UPDATE",
        entity_type: "LEAVE_TYPE",
        entity_id: Number(leaveTypeId),

        old_value: {
            status: existingLeaveType.status
        },

        new_value: {
            status
        },

        ip_address: null,
        user_agent: null
    });

if (!auditResult.success) {
    console.error(
        "Failed to create leave type status audit log."
    );
}

        return {
            success: true,
            message: `Leave type ${status.toLowerCase()} successfully.`
        };


    } catch (error) {

        console.error(
            "Update Leave Type Status Error:",
            error
        );

        return {
            success: false,
            message: "Failed to update leave type status."
        };
    }
};