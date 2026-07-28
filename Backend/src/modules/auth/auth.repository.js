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
        company_id,
        company_name,
        email,
        phone
    } = companyData;

    await connection.execute(
        `
        INSERT INTO companies
        (
            company_id,
            company_name,
            email,
            phone
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            company_id,
            company_name,
            email,
            phone
        ]
    );
};

export const createUser = async (connection, userData) => {

    const {
        user_id,
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
            user_id,
            company_id,
            name,
            email,
            password_hash,
            role
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
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