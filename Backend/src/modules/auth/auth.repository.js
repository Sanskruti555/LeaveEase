
import pool from "../../config/db.js";

export const findCompanyByEmail = async (email) => {
    const [rows] = await pool.execute(
        `
        SELECT company_id, company_name, email
        FROM companies
        WHERE email = ?
        `,
        [email]
    );

    return rows[0];
};

export const findUserByEmail = async (email) => {
    const [rows] = await pool.execute(
        `
        SELECT
        user_id,
        company_id,
        name,
        email,
        password_hash,
        role
        FROM users
        WHERE email = ?
        `,
        [email]
    );

    return rows[0];

};

export const createPendingRegistration = async (data) => {
    const { 
        pending_registration_id,
        company_name, 
        admin_name,
        email, 
        phone,
        password_hash, 
        otp_code,
        otp_expires_at
     } = data;
    const [result] = await pool.execute(
        `
        INSERT INTO pending_registrations 
        (
           pending_registration_id,
           company_name, 
           admin_name,
           email, 
           phone, 
           password_hash, 
           otp_code,
           otp_expires_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [pending_registration_id, 
         company_name, 
         admin_name,
         email, 
         phone, 
         password_hash, 
         otp_code, 
         otp_expires_at]
    );

    return pending_registration_id;

};

export const findPendingRegistrationByEmail = async (email) => {
    const [rows] = await pool.execute(
        `
        SELECT
        pending_registration_id,
        company_name,
        admin_name,
        email,
        phone,
        password_hash,
        otp_code,
        otp_expires_at,
        failed_attempts,
        otp_resend_count,
        status
        FROM pending_registrations
        WHERE email = ?
        `,
        [email]
    );

    return rows[0];
};

export const createCompany = async (connection, companyData) => {

    const {

        company_name,
        email,
        phone
    } = companyData;

    const [result] = await connection.execute(
    `
    INSERT INTO companies
    (
        company_name,
        email,
        phone
    )
    VALUES (?, ?, ?)
    `,
    [
        company_name,
        email,
        phone
    ]
);

return result.insertId;
}

export const createUser = async (connection, userData) => {

    const {
      
        company_id,
        name,
        email,
        password_hash,
        role
    } = userData;

    await connection.execute(
        `
        INSERT INTO users
        (
        
            company_id,
            name,
            email,
            password_hash,
            role
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
           
            company_id,
            name,
            email,
            password_hash,
            role
        ]
    );
};

export const deletePendingRegistration = async (
    connection,
    pending_registration_id
) => {

    await connection.execute(
        `
        DELETE FROM pending_registrations
        WHERE pending_registration_id = ?
        `,
        [pending_registration_id]
    );
};

export const updatePendingRegistration = async (data) => {
    const {
        pending_registration_id,
        otp_code,
        otp_expires_at,
        failed_attempts,
        otp_resend_count,
        status
    } = data;

    await pool.execute(
        `
        UPDATE pending_registrations
        SET
            otp_code = ?,
            otp_expires_at = ?,
            failed_attempts = ?,
            otp_resend_count = ?,
            status = ?
        WHERE pending_registration_id = ?
        `,
        [
            otp_code,
            otp_expires_at,
            failed_attempts,
            otp_resend_count,
            status,
            pending_registration_id
        ]
    );
};

export const findUserById = async (user_id) => {
    const [rows] = await pool.execute(
        `
        SELECT
            user_id,
            company_id,
            name,
            email,
            password_hash,
            role
        FROM users
        WHERE user_id = ?
        `,
        [user_id]
    );

    return rows[0];
};

export const updatePendingRegistrationOTP = async (
    email,
    otp_code,
    otp_expires_at
) => {

    await pool.execute(
        `
        UPDATE pending_registrations
        SET
            otp_code = ?,
            otp_expires_at = ?
        WHERE email = ?
        `,
        [
            otp_code,
            otp_expires_at,
            email
        ]
    );

};

export const updateUserOTP = async (
    email,
    otp_code,
    otp_expires_at
) => {

    await pool.execute(
        `
        UPDATE users
        SET
            otp_code = ?,
            otp_expires_at = ?
        WHERE email = ?
        `,
        [
            otp_code,
            otp_expires_at,
            email
        ]
    );

};

export const updateUserPassword = async (
    email,
    password_hash
) => {

    await pool.execute(
        `
        UPDATE users
        SET
            password_hash = ?,
            otp_code = NULL,
            otp_expires_at = NULL
        WHERE email = ?
        `,
        [
            password_hash,
            email
        ]
    );

};

export const updateUserPasswordById = async (
    userId,
    password_hash
) => {

    await pool.execute(
        `
        UPDATE users
        SET
            password_hash = ?
        WHERE user_id = ?
        `,
        [
            password_hash,
            userId
        ]
    );

};

export const updateUserProfile = async (
    userId,
    name,
    phone
) => {

    await pool.execute(
        `
        UPDATE users
        SET
            name = ?,
            phone = ?
        WHERE user_id = ?
        `,
        [
            name,
            phone,
            userId
        ]
    );

};

