import pool from "../../config/db.js";

export const findUsersByCompany = async (
    companyId,
    filters = {}
) => {

    const {
        role,
        branchId,
        managerId,
        status,
        search,
        limit = 10,
        offset = 0
    } = filters;

    let query = `
        SELECT
            u.user_id,
            u.company_id,
            u.branch_id,
            u.manager_id,
            u.created_by,
            u.name,
            u.email,
            u.phone,
            u.role,
            u.status,
            u.is_email_verified,
            u.last_login,
            u.created_at,
            u.updated_at,
            b.name AS branch_name
        FROM users u
        LEFT JOIN branches b ON u.branch_id = b.branch_id
        WHERE u.company_id = ?
    `;

    const params = [companyId];

    if (role) {
        query += ` AND u.role = ?`;
        params.push(role);
    }

    if (branchId) {
        query += ` AND u.branch_id = ?`;
        params.push(branchId);
    }

    if (managerId) {
        query += ` AND u.manager_id = ?`;
        params.push(managerId);
    }

    if (status) {
        query += ` AND u.status = ?`;
        params.push(status);
    }

    if (search) {
        query += `
            AND (
                u.name LIKE ?
                OR u.email LIKE ?
            )
        `;

        const searchValue = `%${search}%`;

        params.push(searchValue);
        params.push(searchValue);
    }

    query += `
    ORDER BY u.created_at DESC
    LIMIT ${Number(limit)}
    OFFSET ${Number(offset)}
`;

    const [rows] = await pool.execute(
        query,
        params
    );

    return rows.map(user => ({
        ...user,
        branch: user.branch_name || 'Unassigned'
    }));
};



export const countUsersByCompany = async (
    companyId,
    filters = {}
) => {

    const {
        role,
        branchId,
        managerId,
        status,
        search
    } = filters;

    let query = `
        SELECT COUNT(*) AS total
        FROM users u
        WHERE u.company_id = ?
    `;

    const params = [companyId];

    if (role) {
        query += ` AND u.role = ?`;
        params.push(role);
    }

    if (branchId) {
        query += ` AND u.branch_id = ?`;
        params.push(branchId);
    }

    if (managerId) {
        query += ` AND u.manager_id = ?`;
        params.push(managerId);
    }

    if (status) {
        query += ` AND u.status = ?`;
        params.push(status);
    }

    if (search) {
        query += `
            AND (
                u.name LIKE ?
                OR u.email LIKE ?
            )
        `;

        const searchValue = `%${search}%`;

        params.push(searchValue);
        params.push(searchValue);
    }

    const [rows] = await pool.execute(
        query,
        params
    );

    return Number(rows[0].total);
};


export const findUserById = async (
    userId,
    companyId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            u.user_id,
            u.company_id,
            u.branch_id,
            u.manager_id,
            u.created_by,
            u.name,
            u.email,
            u.phone,
            u.role,
            u.status,
            u.is_email_verified,
            u.last_login,
            u.created_at,
            u.updated_at
        FROM users u
        WHERE u.user_id = ?
          AND u.company_id = ?
        LIMIT 1
        `,
        [
            userId,
            companyId
        ]
    );

    return rows[0] || null;
};

export const updateUserStatus = async (
    userId,
    companyId,
    status
) => {

    const [result] = await pool.execute(
        `
        UPDATE users
        SET status = ?
        WHERE user_id = ?
          AND company_id = ?
        `,
        [
            status,
            userId,
            companyId
        ]
    );

    return result.affectedRows > 0;
};