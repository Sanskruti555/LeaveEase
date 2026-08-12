import pool from "../../config/db.js";

export const createBranch = async (data) => {

    const {
        company_id,
        name,
        email,
        phone,
        address,
        city,
        state,
        country
    } = data;

    const [result] = await pool.query(
        `
        INSERT INTO branches (
            company_id,
            name,
            email,
            phone,
            address,
            city,
            state,
            country
        )
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            company_id,
            name,
            email,
            phone,
            address,
            city,
            state,
            country
        ]
    );

    return result.insertId;
};

export const getBranches = async (company_id) => {

    const [rows] = await pool.query(
        `
        SELECT
            branch_id,
            company_id,
            name,
            email,
            phone,
            address,
            city,
            state,
            country,
            status,
            created_at,
            updated_at
        FROM branches
        WHERE company_id = ?
        ORDER BY branch_id DESC
        `,
        [company_id]
    );

    return rows;
};

export const getBranchById = async (
    branchId,
    company_id
) => {

    const [rows] = await pool.query(
        `
        SELECT
            branch_id,
            company_id,
            branch_admin_id,
            name,
            email,
            phone,
            address,
            city,
            state,
            country,
            status,
            created_at,
            updated_at
        FROM branches
        WHERE branch_id = ?
          AND company_id = ?
        LIMIT 1
        `,
        [branchId, company_id]
    );

    return rows[0] || null;
};
export const updateBranch = async (
    branchId,
    company_id,
    data
) => {

    const {
        name,
        email,
        phone,
        address,
        city,
        state,
        country
    } = data;

    const [result] = await pool.query(
        `
        UPDATE branches
        SET
            name = ?,
            email = ?,
            phone = ?,
            address = ?,
            city = ?,
            state = ?,
            country = ?
        WHERE branch_id = ?
          AND company_id = ?
        `,
        [
            name,
            email,
            phone,
            address,
            city,
            state,
            country,
            branchId,
            company_id
        ]
    );

    return result.affectedRows > 0;
};

export const updateBranchStatus = async (
    branchId,
    company_id,
    status
) => {

    const [result] = await pool.query(
        `
        UPDATE branches
        SET status = ?
        WHERE branch_id = ?
          AND company_id = ?
        `,
        [
            status,
            branchId,
            company_id
        ]
    );

    return result.affectedRows > 0;
};

