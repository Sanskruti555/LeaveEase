import pool from "../../config/db.js";


export const getBranchStats = async (companyId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_branches,
            SUM(status = 'ACTIVE') AS active_branches,
            SUM(status = 'INACTIVE') AS inactive_branches
        FROM branches
        WHERE company_id = ?
        `,
        [companyId]
    );

    return rows[0];
};


export const getUserStats = async (companyId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_users,

            SUM(role = 'BRANCH_ADMIN'
                AND status = 'ACTIVE') AS branch_admins,

            SUM(role = 'MANAGER'
                AND status = 'ACTIVE') AS managers,

            SUM(role = 'EMPLOYEE'
                AND status = 'ACTIVE') AS employees

        FROM users
        WHERE company_id = ?
        `,
        [companyId]
    );

    return rows[0];
};


export const getLeaveStats = async (companyId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_requests,

            SUM(lr.status = 'PENDING') AS pending_requests,

            SUM(lr.status = 'APPROVED') AS approved_requests,

            SUM(lr.status = 'REJECTED') AS rejected_requests,

            SUM(lr.status = 'CANCELLED') AS cancelled_requests

        FROM leave_requests lr

        INNER JOIN users u
            ON u.user_id = lr.employee_id

        WHERE u.company_id = ?
        `,
        [companyId]
    );

    return rows[0];
};


export const getLeaveTypeStats = async (companyId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_leave_types,

            SUM(status = 'ACTIVE') AS active_leave_types,

            SUM(status = 'INACTIVE') AS inactive_leave_types

        FROM leave_types
        WHERE company_id = ?
        `,
        [companyId]
    );

    return rows[0];
};


export const getInvitationStats = async (companyId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_invitations,

            SUM(status = 'PENDING') AS pending_invitations,

            SUM(status = 'ACCEPTED') AS accepted_invitations,

            SUM(status = 'CANCELLED') AS cancelled_invitations

        FROM invitations
        WHERE company_id = ?
        `,
        [companyId]
    );

    return rows[0];
};

export const getBranchUserStats = async (
    companyId,
    branchId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            SUM(
                role = 'MANAGER'
                AND status = 'ACTIVE'
            ) AS total_managers,

            SUM(
                role = 'EMPLOYEE'
                AND status = 'ACTIVE'
            ) AS total_employees

        FROM users
        WHERE company_id = ?
          AND branch_id = ?
        `,
        [companyId, branchId]
    );

    const stats = rows[0];

    return {
        total_managers:
            Number(stats.total_managers) || 0,

        total_employees:
            Number(stats.total_employees) || 0
    };
};

export const getBranchLeaveStats = async (
    companyId,
    branchId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_requests,

            COALESCE(
                SUM(lr.status = 'PENDING'),
                0
            ) AS pending_requests,

            COALESCE(
                SUM(lr.status = 'APPROVED'),
                0
            ) AS approved_requests,

            COALESCE(
                SUM(lr.status = 'REJECTED'),
                0
            ) AS rejected_requests,

            COALESCE(
                SUM(lr.status = 'CANCELLED'),
                0
            ) AS cancelled_requests

        FROM leave_requests lr

        INNER JOIN users u
            ON u.user_id = lr.employee_id

        WHERE u.company_id = ?
          AND u.branch_id = ?
        `,
        [companyId, branchId]
    );

    return rows[0];
};

export const getBranchInvitationStats = async (
    companyId,
    branchId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS pending_invitations

        FROM invitations
        WHERE company_id = ?
          AND branch_id = ?
          AND status = 'PENDING'
        `,
        [companyId, branchId]
    );

    return rows[0];
};

export const getBranchLeaveTypeStats = async (companyId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_leave_types,

            SUM(status = 'ACTIVE')
                AS active_leave_types,

            SUM(status = 'INACTIVE')
                AS inactive_leave_types

        FROM leave_types
        WHERE company_id = ?
        `,
        [companyId]
    );

    const stats = rows[0];

    return {
        total_leave_types:
            Number(stats.total_leave_types) || 0,

        active_leave_types:
            Number(stats.active_leave_types) || 0,

        inactive_leave_types:
            Number(stats.inactive_leave_types) || 0
    };
};

export const getManagerUserStats = async (
    companyId,
    branchId,
    managerId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            SUM(
                role = 'EMPLOYEE'
                AND status = 'ACTIVE'
            ) AS total_employees

        FROM users
        WHERE company_id = ?
          AND branch_id = ?
          AND manager_id = ?
        `,
        [
            companyId,
            branchId,
            managerId
        ]
    );

    const stats = rows[0];

    return {
        total_employees:
            Number(stats.total_employees) || 0
    };
};

export const getManagerLeaveStats = async (
    companyId,
    branchId,
    managerId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_requests,

            COALESCE(
                SUM(lr.status = 'PENDING'),
                0
            ) AS pending_requests,

            COALESCE(
                SUM(lr.status = 'APPROVED'),
                0
            ) AS approved_requests,

            COALESCE(
                SUM(lr.status = 'REJECTED'),
                0
            ) AS rejected_requests,

            COALESCE(
                SUM(lr.status = 'CANCELLED'),
                0
            ) AS cancelled_requests

        FROM leave_requests lr

        INNER JOIN users u
            ON u.user_id = lr.employee_id

        WHERE u.company_id = ?
          AND u.branch_id = ?
          AND u.manager_id = ?
        `,
        [
            companyId,
            branchId,
            managerId
        ]
    );

    const stats = rows[0];

    return {
        total_requests:
            Number(stats.total_requests) || 0,

        pending_requests:
            Number(stats.pending_requests) || 0,

        approved_requests:
            Number(stats.approved_requests) || 0,

        rejected_requests:
            Number(stats.rejected_requests) || 0,

        cancelled_requests:
            Number(stats.cancelled_requests) || 0
    };
};

export const getManagerLeaveBalances = async (
    companyId,
    branchId,
    managerId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            u.user_id,
            u.name,
            u.email,

            lb.leave_type_id,

            lt.name AS leave_type_name,

            lb.cycle_start_date,
            lb.cycle_end_date,

            lb.allocated_balance,
            lb.used_balance,
            lb.remaining_balance

        FROM leave_balances lb

        INNER JOIN users u
            ON u.user_id = lb.user_id

        INNER JOIN leave_types lt
            ON lt.leave_type_id = lb.leave_type_id

        WHERE u.company_id = ?
          AND u.branch_id = ?
          AND u.manager_id = ?
          AND u.role = 'EMPLOYEE'
          AND u.status = 'ACTIVE'

        ORDER BY
            u.name,
            lt.name
        `,
        [
            companyId,
            branchId,
            managerId
        ]
    );

    return rows.map(row => ({
        ...row,
        allocated_balance:
            Number(row.allocated_balance),

        used_balance:
            Number(row.used_balance),

        remaining_balance:
            Number(row.remaining_balance)
    }));
};

export const getEmployeeLeaveBalances = async (userId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            lb.leave_type_id,
            lt.name AS leave_type_name,

            lb.cycle_start_date,
            lb.cycle_end_date,

            lb.allocated_balance,
            lb.used_balance,
            lb.remaining_balance

        FROM leave_balances lb

        INNER JOIN leave_types lt
            ON lt.leave_type_id = lb.leave_type_id

        WHERE lb.user_id = ?

        ORDER BY lt.name
        `,
        [userId]
    );

    return rows.map(row => ({
        ...row,
        allocated_balance:
            Number(row.allocated_balance),

        used_balance:
            Number(row.used_balance),

        remaining_balance:
            Number(row.remaining_balance)
    }));
};

export const getEmployeeLeaveStats = async (userId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            COUNT(*) AS total_requests,

            COALESCE(
                SUM(status = 'PENDING'),
                0
            ) AS pending_requests,

            COALESCE(
                SUM(status = 'APPROVED'),
                0
            ) AS approved_requests,

            COALESCE(
                SUM(status = 'REJECTED'),
                0
            ) AS rejected_requests,

            COALESCE(
                SUM(status = 'CANCELLED'),
                0
            ) AS cancelled_requests

        FROM leave_requests

        WHERE employee_id = ?
        `,
        [userId]
    );

    const stats = rows[0];

    return {
        total_requests:
            Number(stats.total_requests) || 0,

        pending_requests:
            Number(stats.pending_requests) || 0,

        approved_requests:
            Number(stats.approved_requests) || 0,

        rejected_requests:
            Number(stats.rejected_requests) || 0,

        cancelled_requests:
            Number(stats.cancelled_requests) || 0
    };
};

export const getEmployeeRecentLeaves = async (userId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            lr.request_id,
            lr.leave_type_id,
            lt.name AS leave_type_name,
            lr.start_date,
            lr.end_date,
            lr.duration_type,
            lr.reason,
            lr.status,
            lr.created_at

        FROM leave_requests lr

        INNER JOIN leave_types lt
            ON lt.leave_type_id = lr.leave_type_id

        WHERE lr.employee_id = ?

        ORDER BY lr.created_at DESC

        LIMIT 5
        `,
        [userId]
    );

    return rows;
};

export const getCompanyUsersWithBranches = async (companyId) => {
    const [rows] = await pool.execute(
        `
        SELECT 
            u.user_id,
            u.company_id,
            u.branch_id,
            u.name,
            u.email,
            u.role,
            u.status,
            u.created_at,
            b.name AS branch_name
        FROM users u
        LEFT JOIN branches b ON u.branch_id = b.branch_id
        WHERE u.company_id = ?
        ORDER BY u.created_at DESC
        `,
        [companyId]
    );

    return rows;
};