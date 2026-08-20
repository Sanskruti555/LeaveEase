import * as leaveRepository from "./leave.repository.js";
import * as notificationService
    from "../notifications/notification.service.js";
import * as auditLogService
    from "../auditLogs/auditLog.service.js";


const getOrCreateLeaveBalance = async (
    userId,
    leaveType,
    requestDate
) => {

    let balance =
        await leaveRepository.findLeaveBalance(
            userId,
            leaveType.leave_type_id,
            requestDate
        );

   if (!balance) {

    const date = new Date(requestDate);

    let cycleStartDate;
    let cycleEndDate;

    if (
        leaveType.allocation_frequency === "YEARLY"
    ) {

        const year = date.getFullYear();

        cycleStartDate =
            `${year}-01-01`;

        cycleEndDate =
            `${year}-12-31`;

    } else if (
        leaveType.allocation_frequency === "MONTHLY"
    ) {

        const year = date.getFullYear();
        const month = date.getMonth();

        const startDate = new Date(
            year,
            month,
            1
        );

        const endDate = new Date(
            year,
            month + 1,
            0
        );

        cycleStartDate =
            startDate.toISOString().split("T")[0];

        cycleEndDate =
            endDate.toISOString().split("T")[0];

    } else if (
        leaveType.allocation_frequency === "QUARTERLY"
    ) {

        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / 3);

        const startDate = new Date(
            year,
            quarter * 3,
            1
        );

        const endDate = new Date(
            year,
            (quarter + 1) * 3,
            0
        );

        cycleStartDate =
            startDate.toISOString().split("T")[0];

        cycleEndDate =
            endDate.toISOString().split("T")[0];

    } else if (
        leaveType.allocation_frequency === "HALF_YEARLY"
    ) {

        const year = date.getFullYear();
        const half = date.getMonth() < 6 ? 0 : 1;

        if (half === 0) {
            cycleStartDate = `${year}-01-01`;
            cycleEndDate = `${year}-06-30`;
        } else {
            cycleStartDate = `${year}-07-01`;
            cycleEndDate = `${year}-12-31`;
        }

    } else if (
        leaveType.allocation_frequency === "ONE_TIME" ||
        leaveType.allocation_frequency === "ONCE"
    ) {

        // One-time allocation
        cycleStartDate =
            date.toISOString().split("T")[0];

        cycleEndDate =
            date.toISOString().split("T")[0];

    } else {

        throw new Error(
            "Invalid leave allocation frequency."
        );
    }

    await leaveRepository.createLeaveBalance({
        user_id: userId,
        leave_type_id:
            leaveType.leave_type_id,
        cycle_start_date: cycleStartDate,
        cycle_end_date: cycleEndDate,
        allocated_balance:
            leaveType.leave_allocation
    });

    balance =
        await leaveRepository.findLeaveBalance(
            userId,
            leaveType.leave_type_id,
            requestDate
        );
}

    return balance;
};

const calculateLeaveDays = (
    startDate,
    endDate,
    durationType
) => {

    const start = new Date(startDate);
    const end = new Date(endDate);

    // HALF_DAY must be for a single date
    if (durationType === "HALF_DAY") {

        if (start.toDateString() !== end.toDateString()) {
            return null;
        }

        return 0.5;
    }

    const millisecondsPerDay =
        1000 * 60 * 60 * 24;

    const difference =
        end.getTime() - start.getTime();

    return (
        Math.floor(difference / millisecondsPerDay) + 1
    );
};

export const applyLeave = async (user, data , file) => {

    try {

        const {
            user_id,
            company_id,
            role
        } = user;

        const {
            leave_type_id,
            start_date,
            end_date,
            duration_type,
            reason
        } = data;


        // Only employees can apply for leave
        if (role !== "EMPLOYEE") {
            return {
                success: false,
                message: "Only employees can apply for leave."
            };
        }


        // Find leave type
        const leaveType =
            await leaveRepository.findLeaveTypeById(
                leave_type_id,
                company_id
            );


        // Leave type must exist in employee's company
        if (!leaveType) {
            return {
                success: false,
                message: "Leave type not found."
            };
        }


        // Leave type must be active
        if (leaveType.status !== "ACTIVE") {
            return {
                success: false,
                message: "This leave type is currently inactive."
            };
        }

        // Supporting document check
        if (leaveType.requires_attachment && !file) {
            return {
                success: false,
                message: "Supporting document is required for this leave type."
            };
        }


        // Date safety check
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate < startDate) {
            return {
                success: false,
                message: "End date cannot be before start date."
            };
        }


        // Don't allow a leave request to cross balance cycles/years
        if (
            startDate.getFullYear() !==
            endDate.getFullYear()
        ) {
            return {
                success: false,
                message: "Leave request cannot span multiple years."
            };
        }


        // Calculate requested leave days
        const requestedDays =
            calculateLeaveDays(
                start_date,
                end_date,
                duration_type
            );


        // HALF_DAY must be on a single date
        if (requestedDays === null) {
            return {
                success: false,
                message: "Half-day leave can only be applied for a single date."
            };
        }


        // Find existing balance or initialize one
        const balance =
            await getOrCreateLeaveBalance(
                user_id,
                leaveType,
                start_date
            );


        if (!balance) {
            return {
                success: false,
                message: "Unable to initialize leave balance."
            };
        }


        // Our real DB already stores remaining balance
        const availableBalance =
            Number(balance.remaining_balance);


        // Check whether employee has enough leave
        if (requestedDays > availableBalance) {

            return {
                success: false,
                message: "Insufficient leave balance.",
                data: {
                    requested_days: requestedDays,
                    available_balance: availableBalance
                }
            };
        }

        const overlappingLeave =
    await leaveRepository.findOverlappingLeave(
        user_id,
        start_date,
        end_date
    );

if (overlappingLeave) {
    return {
        success: false,
        message:
            "You already have a leave request for the selected dates."
    };
}

        // Create leave request
        const requestId =
            await leaveRepository.createLeaveRequest({
                employee_id: user_id,
                leave_type_id,
                start_date,
                end_date,
                duration_type,
                reason,
                attachment_path: file
                ? file.path
                : null
            });

          const employeeManager =
    await leaveRepository.findManagerByEmployeeId(
        user_id,
        company_id
    );

if (employeeManager?.manager_id) {

    const notificationResult =
        await notificationService.createNotification({
            company_id,
            user_id: employeeManager.manager_id,
            notification_type: "LEAVE_APPLIED",
            entity_type: "LEAVE_REQUEST",
            entity_id: requestId
        });

    if (!notificationResult.success) {
        console.error(
            "Failed to create leave application notification."
        );
    }
}

        return {
            success: true,
            message: "Leave request submitted successfully.",
            data: {
                request_id: requestId,
                requested_days: requestedDays,
                status: "PENDING"
            }
        };


    } catch (error) {

        console.error(
            "Apply Leave Error:",
            error
        );

        return {
            success: false,
            message: "Failed to submit leave request."
        };
    }
};

export const getMyLeaves = async (user) => {

    try {

        const {
            user_id,
            role
        } = user;

        // Only employees can view their own leave history
        if (role !== "EMPLOYEE") {
            return {
                success: false,
                message: "Only employees can view their leave requests."
            };
        }

        const leaveRequests =
            await leaveRepository.findLeaveRequestsByEmployee(
                user_id
            );

        return {
            success: true,
            data: leaveRequests
        };

    } catch (error) {

        console.error(
            "Get My Leaves Error:",
            error
        );

        return {
            success: false,
            message: "Failed to fetch leave requests."
        };
    }
};

export const getTeamLeaves = async (user) => {

    try {

        const {
            user_id,
            company_id,
            role
        } = user;


        // Only managers can view their team's leave requests
        if (role !== "MANAGER") {
            return {
                success: false,
                message: "Only managers can view team leave requests."
            };
        }


        const leaveRequests =
            await leaveRepository.findTeamLeaveRequests(
                user_id,
                company_id
            );


        return {
            success: true,
            data: leaveRequests
        };


    } catch (error) {

        console.error(
            "Get Team Leaves Error:",
            error
        );

        return {
            success: false,
            message: "Failed to fetch team leave requests."
        };
    }
};

export const approveLeave = async (user, requestId) => {

    try {

        const {
            user_id,
            company_id,
            role
        } = user;


        // Only managers can approve leave
        if (role !== "MANAGER") {
            return {
                success: false,
                message: "Only managers can approve leave requests."
            };
        }


        // Find request and verify employee belongs to manager
        const leaveRequest =
            await leaveRepository.findLeaveRequestForManager(
                requestId,
                user_id,
                company_id
            );


        if (!leaveRequest) {
            return {
                success: false,
                message:
                    "Leave request not found or you are not authorized to approve it."
            };
        }


        // Only pending requests can be approved
        if (leaveRequest.status !== "PENDING") {
            return {
                success: false,
                message:
                    `Leave request is already ${leaveRequest.status.toLowerCase()}.`
            };
        }


        // Calculate how many leave days must be deducted
        const requestedDays =
            calculateLeaveDays(
                leaveRequest.start_date,
                leaveRequest.end_date,
                leaveRequest.duration_type
            );


        if (requestedDays === null) {
            return {
                success: false,
                message: "Invalid leave duration."
            };
        }


        // Approve request + deduct balance in ONE transaction
        await leaveRepository.approveLeaveWithBalance(
            requestId,
            user_id,
            leaveRequest.employee_id,
            leaveRequest.leave_type_id,
            leaveRequest.start_date,
            requestedDays
        );

        const auditResult =
    await auditLogService.createAuditLog({
        company_id,
        user_id,
        action: "UPDATE",
        entity_type: "LEAVE_REQUEST",
        entity_id: Number(requestId),

        old_value: {
            status: "PENDING"
        },

        new_value: {
            status: "APPROVED"
        },

        ip_address: null,
        user_agent: null
    });

if (!auditResult.success) {
    console.error(
        "Failed to create leave approval audit log."
    );
}

        const notificationResult =
    await notificationService.createNotification({
        company_id,
        user_id: leaveRequest.employee_id,
        notification_type: "LEAVE_APPROVED",
        entity_type: "LEAVE_REQUEST",
        entity_id: Number(requestId)
    });

if (!notificationResult.success) {
    console.error(
        "Failed to create leave approval notification."
    );
}

        return {
            success: true,
            message: "Leave request approved successfully.",
            data: {
                request_id: Number(requestId),
                deducted_days: requestedDays
            }
        };


    } catch (error) {

        console.error(
            "Approve Leave Error:",
            error
        );


        if (error.message === "Insufficient leave balance.") {
            return {
                success: false,
                message: "Insufficient leave balance."
            };
        }


        if (
            error.message ===
            "Leave request is no longer pending."
        ) {
            return {
                success: false,
                message: "Leave request is no longer pending."
            };
        }


        if (error.message === "Leave balance not found.") {
            return {
                success: false,
                message: "Leave balance not found."
            };
        }


        return {
            success: false,
            message: "Failed to approve leave request."
        };
    }
};
export const rejectLeave = async (
    user,
    requestId,
    data
) => {

    try {

        const {
            user_id,
            company_id,
            role
        } = user;

        const {
            rejection_reason
        } = data;


        // Only managers can reject leave
        if (role !== "MANAGER") {
            return {
                success: false,
                message: "Only managers can reject leave requests."
            };
        }


        // Rejection reason is required
        if (
            !rejection_reason ||
            rejection_reason.trim().length === 0
        ) {
            return {
                success: false,
                message: "Rejection reason is required."
            };
        }


        // Verify request belongs to this manager's employee
        const leaveRequest =
            await leaveRepository.findLeaveRequestForManager(
                requestId,
                user_id,
                company_id
            );


        if (!leaveRequest) {
            return {
                success: false,
                message: "Leave request not found or you are not authorized to reject it."
            };
        }


        // Only pending requests can be rejected
        if (leaveRequest.status !== "PENDING") {
            return {
                success: false,
                message: `Leave request is already ${leaveRequest.status.toLowerCase()}.`
            };
        }


        const affectedRows =
            await leaveRepository.rejectLeaveRequest(
                requestId,
                rejection_reason.trim()
            );


        if (affectedRows === 0) {
            return {
                success: false,
                message: "Leave request could not be rejected."
            };
        }

        const auditResult =
    await auditLogService.createAuditLog({
        company_id,
        user_id,
        action: "UPDATE",
        entity_type: "LEAVE_REQUEST",
        entity_id: Number(requestId),

        old_value: {
            status: "PENDING"
        },

        new_value: {
            status: "REJECTED",
            rejection_reason: rejection_reason.trim()
        },

        ip_address: null,
        user_agent: null
    });

if (!auditResult.success) {
    console.error(
        "Failed to create leave rejection audit log."
    );
}

        const notificationResult =
    await notificationService.createNotification({
        company_id,
        user_id: leaveRequest.employee_id,
        notification_type: "LEAVE_REJECTED",
        entity_type: "LEAVE_REQUEST",
        entity_id: Number(requestId)
    });

if (!notificationResult.success) {
    console.error(
        "Failed to create leave rejection notification."
    );
}

        return {
            success: true,
            message: "Leave request rejected successfully."
        };


    } catch (error) {

        console.error(
            "Reject Leave Error:",
            error
        );

        return {
            success: false,
            message: "Failed to reject leave request."
        };
    }
};

export const getLeaveBalances = async (user) => {

    try {

        const {
            user_id,
            role
        } = user;


        if (role !== "EMPLOYEE") {
            return {
                success: false,
                message: "Only employees can view leave balances."
            };
        }


        const balances =
            await leaveRepository.findLeaveBalancesByUser(
                user_id
            );


        return {
            success: true,
            data: balances
        };

    } catch (error) {

        console.error(
            "Get Leave Balances Error:",
            error
        );

        return {
            success: false,
            message: "Failed to fetch leave balances."
        };
    }
};

export const cancelLeave = async (
    user,
    requestId
) => {

    try {

        const {
            user_id,
            company_id,
            role
        } = user;


        // Only employees can cancel leave
        if (role !== "EMPLOYEE") {
            return {
                success: false,
                message: "Only employees can cancel leave requests."
            };
        }


        // Find employee's own leave request
        const leaveRequest =
            await leaveRepository.findLeaveRequestByEmployee(
                requestId,
                user_id
            );


        if (!leaveRequest) {
            return {
                success: false,
                message: "Leave request not found."
            };
        }


        // Only pending leave can be cancelled
        if (leaveRequest.status !== "PENDING") {
            return {
                success: false,
                message: `Only pending leave requests can be cancelled. Current status is ${leaveRequest.status}.`
            };
        }


        // Cancel leave
        await leaveRepository.cancelLeaveRequest(
            requestId
        );

        const auditResult =
    await auditLogService.createAuditLog({
        company_id,
        user_id,
        action: "UPDATE",
        entity_type: "LEAVE_REQUEST",
        entity_id: Number(requestId),

        old_value: {
            status: "PENDING"
        },

        new_value: {
            status: "CANCELLED"
        },

        ip_address: null,
        user_agent: null
    });

if (!auditResult.success) {
    console.error(
        "Failed to create leave cancellation audit log."
    );
}

        // Find employee's manager
const employeeManager =
    await leaveRepository.findManagerByEmployeeId(
        user_id,
        company_id
    );

if (employeeManager?.manager_id) {

    const notificationResult =
        await notificationService.createNotification({
            company_id,
            user_id: employeeManager.manager_id,
            notification_type: "LEAVE_CANCELLED",
            entity_type: "LEAVE_REQUEST",
            entity_id: Number(requestId)
        });

    if (!notificationResult.success) {
        console.error(
            "Failed to create leave cancellation notification."
        );
    }
}




        return {
            success: true,
            message: "Leave request cancelled successfully."
        };

    } catch (error) {

        console.error(
            "Cancel Leave Error:",
            error
        );

        return {
            success: false,
            message: "Failed to cancel leave request."
        };
    }
};