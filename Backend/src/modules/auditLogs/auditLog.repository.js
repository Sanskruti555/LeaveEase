import pool from "../../config/db.js";

export const createAuditLog = async (data) => {

    const {
        company_id,
        user_id,
        action,
        entity_type,
        entity_id,
        old_value,
        new_value,
        ip_address,
        user_agent
    } = data;


    const [result] = await pool.execute(
        `
        INSERT INTO audit_logs (
            company_id,
            user_id,
            action,
            entity_type,
            entity_id,
            old_value,
            new_value,
            ip_address,
            user_agent
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            company_id,
            user_id,
            action,
            entity_type,
            entity_id,
            old_value
                ? JSON.stringify(old_value)
                : null,
            new_value
                ? JSON.stringify(new_value)
                : null,
            ip_address || null,
            user_agent || null
        ]
    );


    return result.insertId;
};

