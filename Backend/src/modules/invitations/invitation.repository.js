import pool from "../../config/db.js";

export const findUserByEmail = async (email) => {
    const [rows] = await pool.execute(
        `
        SELECT user_id, company_id, email, role
        FROM users
        WHERE email = ?
        `,
        [email]
    );

    return rows[0];
};


export const findPendingInvitationByEmail = async (
    companyId,
    email
) => {
    const [rows] = await pool.execute(
        `
        SELECT *
        FROM invitations
        WHERE company_id = ?
          AND email = ?
          AND status = 'PENDING'
        LIMIT 1
        `,
        [companyId, email]
    );

    return rows[0];
};


export const createInvitation = async (data) => {

    const {
        company_id,
        branch_id,
        manager_id,
        email,
        role,
        invited_by,
        invitation_token,
        expires_at
    } = data;

    const [result] = await pool.execute(
        `
        INSERT INTO invitations (
            company_id,
            branch_id,
            manager_id,
            email,
            role,
            invited_by,
            invitation_token,
            expires_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            company_id,
            branch_id ?? null,
            manager_id ?? null,
            email,
            role,
            invited_by,
            invitation_token,
            expires_at
        ]
    );

    return result.insertId;
};

export const findUserById = async (userId) => {
    const [rows] = await pool.execute(
        `
        SELECT
            user_id,
            company_id,
            branch_id,
            manager_id,
            name,
            email,
            role,
            status
        FROM users
        WHERE user_id = ?
        `,
        [userId]
    );

    return rows[0];
};

export const findBranchById = async (branchId) => {
    const [rows] = await pool.execute(
        `
        SELECT
            branch_id,
            company_id,
            name,
            status
        FROM branches
        WHERE branch_id = ?
        `,
        [branchId]
    );

    return rows[0];
};

export const findManagerById = async (managerId) => {
    const [rows] = await pool.execute(
        `
        SELECT
            user_id,
            company_id,
            branch_id,
            name,
            email,
            role,
            status
        FROM users
        WHERE user_id = ?
          AND role = 'MANAGER'
        `,
        [managerId]
    );

    return rows[0];
};

export const findInvitationByToken = async (token) => {
    const [rows] = await pool.execute(
        `
        SELECT
            invitation_id,
            company_id,
            branch_id,
            manager_id,
            email,
            role,
            invited_by,
            invitation_token,
            status,
            expires_at,
            created_at
        FROM invitations
        WHERE invitation_token = ?
        LIMIT 1
        `,
        [token]
    );

    return rows[0];
};

export const createInvitedUser = async (
    connection,
    data
) => {
    const {
        company_id,
        branch_id,
        manager_id,
        created_by,
        name,
        email,
        phone,
        password_hash,
        role
    } = data;

    const [result] = await connection.execute(
        `
        INSERT INTO users (
            company_id,
            branch_id,
            manager_id,
            created_by,
            name,
            email,
            phone,
            password_hash,
            role,
            is_email_verified
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
        `,
        [
            company_id,
            branch_id ?? null,
            manager_id ?? null,
            created_by,
            name,
            email,
            phone ?? null,
            password_hash,
            role
        ]
    );

    return result.insertId;
};

export const markInvitationAccepted = async (
    connection,
    invitationId
) => {
    await connection.execute(
        `
        UPDATE invitations
        SET
            status = 'ACCEPTED',
            accepted_at = CURRENT_TIMESTAMP
        WHERE invitation_id = ?
        `,
        [invitationId]
    );
};

export const deleteInvitationById = async (invitationId) => {
    await pool.execute(
        `
        DELETE FROM invitations
        WHERE invitation_id = ?
        `,
        [invitationId]
    );
};

export const updateInvitationToken = async (
    invitationId,
    token,
    expiresAt
) => {

    await pool.execute(
        `
        UPDATE invitations
        SET
            invitation_token = ?,
            expires_at = ?,
            status = 'PENDING'
        WHERE invitation_id = ?
        `,
        [
            token,
            expiresAt,
            invitationId
        ]
    );
};

export const findInvitationById = async (invitationId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            invitation_id,
            company_id,
            branch_id,
            manager_id,
            email,
            role,
            invited_by,
            invitation_token,
            status,
            expires_at,
            accepted_at,
            created_at
        FROM invitations
        WHERE invitation_id = ?
        LIMIT 1
        `,
        [invitationId]
    );

    return rows[0];
};

export const cancelInvitation = async (invitationId) => {
    await pool.execute(
        `
        UPDATE invitations
        SET status = 'CANCELLED'
        WHERE invitation_id = ?
          AND status = 'PENDING'
        `,
        [invitationId]
    );
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