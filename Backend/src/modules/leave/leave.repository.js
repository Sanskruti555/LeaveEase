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

export const findLeaveBalance = async (
    userId,
    leaveTypeId,
    date
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            balance_id,
            user_id,
            leave_type_id,
            cycle_start_date,
            cycle_end_date,
            allocated_balance,
            used_balance,
            remaining_balance
        FROM leave_balances
        WHERE user_id = ?
          AND leave_type_id = ?
          AND ? BETWEEN cycle_start_date AND cycle_end_date
        LIMIT 1
        `,
        [
            userId,
            leaveTypeId,
            date
        ]
    );

    return rows[0];
};

export const createLeaveBalance = async (data) => {

    const {
        user_id,
        leave_type_id,
        cycle_start_date,
        cycle_end_date,
        allocated_balance
    } = data;

    const [result] = await pool.execute(
        `
        INSERT INTO leave_balances (
            user_id,
            leave_type_id,
            cycle_start_date,
            cycle_end_date,
            allocated_balance,
            used_balance,
            remaining_balance
        )
        VALUES (?, ?, ?, ?, ?, 0, ?)
        `,
        [
            user_id,
            leave_type_id,
            cycle_start_date,
            cycle_end_date,
            allocated_balance,
            allocated_balance
        ]
    );

    return result.insertId;
};

export const approveLeaveWithBalance = async (
    requestId,
    managerId,
    employeeId,
    leaveTypeId,
    requestDate,
    requestedDays
) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();


        // 1. Lock the employee's leave balance
        const [balanceRows] = await connection.execute(
            `
            SELECT
                balance_id,
                allocated_balance,
                used_balance,
                remaining_balance
            FROM leave_balances
            WHERE user_id = ?
              AND leave_type_id = ?
              AND ? BETWEEN cycle_start_date AND cycle_end_date
            LIMIT 1
            FOR UPDATE
            `,
            [
                employeeId,
                leaveTypeId,
                requestDate
            ]
        );


        const balance = balanceRows[0];


        if (!balance) {
            throw new Error("Leave balance not found.");
        }


        // 2. Make sure balance is still sufficient
        if (
            Number(balance.remaining_balance) <
            requestedDays
        ) {
            throw new Error("Insufficient leave balance.");
        }


        // 3. Approve the leave request
        const [leaveResult] = await connection.execute(
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


        if (leaveResult.affectedRows === 0) {
            throw new Error(
                "Leave request is no longer pending."
            );
        }


        // 4. Deduct leave balance
        await connection.execute(
            `
            UPDATE leave_balances
            SET
                used_balance =
                    used_balance + ?,

                remaining_balance =
                    remaining_balance - ?

            WHERE balance_id = ?
            `,
            [
                requestedDays,
                requestedDays,
                balance.balance_id
            ]
        );


        // Everything succeeded
        await connection.commit();

        return true;


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();
    }
};

export const findLeaveBalancesByUser = async (userId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            lb.balance_id,

            lt.leave_type_id,
            lt.name AS leave_type,

            lb.cycle_start_date,
            lb.cycle_end_date,

            lb.allocated_balance,
            lb.used_balance,
            lb.remaining_balance

        FROM leave_balances lb

        INNER JOIN leave_types lt
            ON lb.leave_type_id = lt.leave_type_id

        WHERE lb.user_id = ?

        ORDER BY lt.name
        `,
        [userId]
    );

    return rows;
};

export const findOverlappingLeave = async (
    employeeId,
    startDate,
    endDate
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            request_id,
            start_date,
            end_date,
            status
        FROM leave_requests
        WHERE employee_id = ?
          AND status IN ('PENDING', 'APPROVED')
          AND start_date <= ?
          AND end_date >= ?
        LIMIT 1
        `,
        [
            employeeId,
            endDate,
            startDate
        ]
    );

    return rows[0];
};

export const findLeaveRequestByEmployee = async (
    requestId,
    employeeId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            request_id,
            employee_id,
            status
        FROM leave_requests
        WHERE request_id = ?
          AND employee_id = ?
        LIMIT 1
        `,
        [
            requestId,
            employeeId
        ]
    );

    return rows[0];
};

export const cancelLeaveRequest = async (
    requestId
) => {

    await pool.execute(
        `
        UPDATE leave_requests
        SET status = 'CANCELLED'
        WHERE request_id = ?
        `,
        [requestId]
    );
};

export const findManagerByEmployeeId = async (
    employeeId,
    companyId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            manager_id
        FROM users
        WHERE user_id = ?
          AND company_id = ?
          AND role = 'EMPLOYEE'
        LIMIT 1
        `,
        [
            employeeId,
            companyId
        ]
    );

    return rows[0];
};

export const findEmployeeByLeaveRequestId = async (
    requestId,
    companyId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            l.employee_id
        FROM leaves l
        INNER JOIN users u
            ON l.employee_id = u.user_id
        WHERE l.request_id = ?
          AND u.company_id = ?
        LIMIT 1
        `,
        [
            requestId,
            companyId
        ]
    );

    return rows[0];
};