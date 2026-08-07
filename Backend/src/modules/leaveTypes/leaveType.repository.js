import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import pool from "../../config/db.js";

export const findLeaveTypeByName = async (
    companyId,
    name
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            leave_type_id,
            name
        FROM leave_types
        WHERE company_id = ?
          AND LOWER(name) = LOWER(?)
        LIMIT 1
        `,
        [
            companyId,
            name
        ]
    );

    return rows[0];
};

export const createLeaveType = async (data) => {

    const {
        company_id,
        name,
        description,
        leave_allocation,
        allocation_frequency,
        status
    } = data;

    const [result] = await pool.execute(
        `
        INSERT INTO leave_types (
            company_id,
            name,
            description,
            leave_allocation,
            allocation_frequency,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            company_id,
            name,
            description,
            leave_allocation,
            allocation_frequency,
            status
        ]
    );

    return result.insertId;
};

export const findLeaveTypesByCompany = async (
    companyId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            leave_type_id,
            name,
            description,
            leave_allocation,
            allocation_frequency,
            status,
            created_at,
            updated_at
        FROM leave_types
        WHERE company_id = ?
        ORDER BY name ASC
        `,
        [companyId]
    );

    return rows;
};