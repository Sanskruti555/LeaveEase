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