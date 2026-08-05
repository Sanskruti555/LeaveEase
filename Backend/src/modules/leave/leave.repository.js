import pool from "../../config/db.js";


export const findLeaveTypeById = async (
    leaveTypeId,
    companyId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            leave_type_id,
            company_id,
            name,
            leave_allocation,
            allocation_frequency,
            is_paid,
            requires_attachment,
            manager_approval_required,
            status
        FROM leave_types
        WHERE leave_type_id = ?
          AND company_id = ?
        LIMIT 1
        `,
        [
            leaveTypeId,
            companyId
        ]
    );

    return rows[0];
};

export const createLeaveRequest = async (data) => {

    const {
        employee_id,
        leave_type_id,
        start_date,
        end_date,
        duration_type,
        reason,
        attachment_path
    } = data;

    const [result] = await pool.execute(
        `
        INSERT INTO leave_requests (
            employee_id,
            leave_type_id,
            start_date,
            end_date,
            duration_type,
            reason,
            attachment_path
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            employee_id,
            leave_type_id,
            start_date,
            end_date,
            duration_type,
            reason,
            attachment_path ?? null
        ]
    );

    return result.insertId;
};

export const findLeaveRequestsByEmployee = async (employeeId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            lr.request_id,
            lr.leave_type_id,
            lt.name AS leave_type,
            lr.start_date,
            lr.end_date,
            lr.duration_type,
            lr.reason,
            lr.status,
            lr.approved_by,
            lr.approved_at,
            lr.rejection_reason,
            lr.created_at,
            lr.updated_at
        FROM leave_requests lr

        INNER JOIN leave_types lt
            ON lr.leave_type_id = lt.leave_type_id

        WHERE lr.employee_id = ?

        ORDER BY lr.created_at DESC
        `,
        [employeeId]
    );

    return rows;
};

export const findTeamLeaveRequests = async (
    managerId,
    companyId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            lr.request_id,
            lr.employee_id,
            u.name AS employee_name,
            u.email AS employee_email,

            lr.leave_type_id,
            lt.name AS leave_type,

            lr.start_date,
            lr.end_date,
            lr.duration_type,
            lr.reason,
            lr.status,

            lr.approved_by,
            lr.approved_at,
            lr.rejection_reason,

            lr.created_at,
            lr.updated_at

        FROM leave_requests lr

        INNER JOIN users u
            ON lr.employee_id = u.user_id

        INNER JOIN leave_types lt
            ON lr.leave_type_id = lt.leave_type_id

        WHERE u.manager_id = ?
          AND u.company_id = ?

        ORDER BY lr.created_at DESC
        `,
        [
            managerId,
            companyId
        ]
    );

    return rows;
};

export const findLeaveRequestForManager = async (
    requestId,
    managerId,
    companyId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            lr.request_id,
            lr.employee_id,
            lr.leave_type_id,
            lr.start_date,
            lr.end_date,
            lr.duration_type,
            lr.reason,
            lr.status,
            lr.approved_by,
            lr.approved_at,
            lr.rejection_reason,

            u.manager_id,
            u.company_id,
            u.branch_id

        FROM leave_requests lr

        INNER JOIN users u
            ON lr.employee_id = u.user_id

        WHERE lr.request_id = ?
          AND u.manager_id = ?
          AND u.company_id = ?

        LIMIT 1
        `,
        [
            requestId,
            managerId,
            companyId
        ]
    );

    return rows[0];
};

export const approveLeaveRequest = async (
    requestId,
    managerId
) => {

    const [result] = await pool.execute(
        `
        UPDATE leave_requests
        SET
            status = 'APPROVED',
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP,
            rejection_reason = NULL
        WHERE request_id = ?
          AND status = 'PENDING'
        `,
        [
            managerId,
            requestId
        ]
    );

    return result.affectedRows;
};

export const rejectLeaveRequest = async (
    requestId,
    managerId,
    rejectionReason
) => {

    const [result] = await pool.execute(
        `
        UPDATE leave_requests
        SET
            status = 'REJECTED',
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP,
            rejection_reason = ?
        WHERE request_id = ?
          AND status = 'PENDING'
        `,
        [
            managerId,
            rejectionReason,
            requestId
        ]
    );

    return result.affectedRows;
};

