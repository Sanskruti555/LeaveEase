import * as leaveRepository from "./leave.repository.js";


export const applyLeave = async (user, data) => {

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


        // Extra date safety check
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate < startDate) {
            return {
                success: false,
                message: "End date cannot be before start date."
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
                attachment_path: null
            });


        return {
            success: true,
            message: "Leave request submitted successfully.",
            data: {
                request_id: requestId,
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


        // Find request and verify that employee
        // actually belongs to this manager
        const leaveRequest =
            await leaveRepository.findLeaveRequestForManager(
                requestId,
                user_id,
                company_id
            );


        if (!leaveRequest) {
            return {
                success: false,
                message: "Leave request not found or you are not authorized to approve it."
            };
        }


        // Only pending requests can be approved
        if (leaveRequest.status !== "PENDING") {
            return {
                success: false,
                message: `Leave request is already ${leaveRequest.status.toLowerCase()}.`
            };
        }


        const affectedRows =
            await leaveRepository.approveLeaveRequest(
                requestId,
                user_id
            );


        if (affectedRows === 0) {
            return {
                success: false,
                message: "Leave request could not be approved."
            };
        }


        return {
            success: true,
            message: "Leave request approved successfully."
        };


    } catch (error) {

        console.error(
            "Approve Leave Error:",
            error
        );

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
                user_id,
                rejection_reason.trim()
            );


        if (affectedRows === 0) {
            return {
                success: false,
                message: "Leave request could not be rejected."
            };
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