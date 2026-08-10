import pool from "../../config/db.js";

export const findNotificationsByUser = async (
    userId,
    companyId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            notification_id,
            notification_type,
            entity_type,
            entity_id,
            is_read,
            created_at
        FROM notifications
        WHERE user_id = ?
          AND company_id = ?
        ORDER BY created_at DESC
        `,
        [
            userId,
            companyId
        ]
    );

    return rows;
};

export const createNotification = async (data) => {

    const {
        company_id,
        user_id,
        notification_type,
        entity_type,
        entity_id
    } = data;

    const [result] = await pool.execute(
        `
        INSERT INTO notifications (
            company_id,
            user_id,
            notification_type,
            entity_type,
            entity_id
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            company_id,
            user_id,
            notification_type,
            entity_type,
            entity_id
        ]
    );

    return result.insertId;
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

export const markNotificationAsRead = async (
    notificationId,
    userId,
    companyId
) => {

    const [result] = await pool.execute(
        `
        UPDATE notifications
        SET is_read = TRUE
        WHERE notification_id = ?
          AND user_id = ?
          AND company_id = ?
        `,
        [
            notificationId,
            userId,
            companyId
        ]
    );

    return result.affectedRows;
};