import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import pool from "../../config/db.js";
import * as authRepository from "./auth.repository.js";

import { sendOTPEmail } from "../../utils/email.js";
import { generateOTP, getOTPExpiry } from "../../utils/otp.js";

export const registerCompany = async (data) => {

    try {

        const {
            company_name,
            admin_name,
            email,
            phone,
            password
        } = data;

        // Check company
        const existingCompany =
            await authRepository.findCompanyByEmail(email);

        if (existingCompany) {
            return {
                success: false,
                message: "Company already exists."
            };
        }

        // Check user
        const existingUser =
            await authRepository.findUserByEmail(email);

        if (existingUser) {
            return {
                success: false,
                message: "User already exists."
            };
        }

        // Check pending registration
        const pendingRegistration =
            await authRepository.findPendingRegistrationByEmail(email);

        if (pendingRegistration) {
            return {
                success: false,
                message: "A pending registration already exists for this email."
            };
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Generate IDs & OTP
        const pending_registration_id = uuidv4();
        const otp_code = generateOTP();
        const otp_expires_at = getOTPExpiry();

        // Prepare object
        const pendingRegistrationData = {
            pending_registration_id,
            company_name,
            admin_name,
            email,
            phone,
            password_hash,
            otp_code,
            otp_expires_at
        };

        // Save
        await authRepository.createPendingRegistration(
            pendingRegistrationData
        );

        // Send OTP
        await sendOTPEmail(email, otp_code);

        return {
            success: true,
            message: "OTP sent successfully."
        };

    } catch (error) {

        console.error("Register Company Error:", error);

        return {
            success: false,
            message: "Failed to register company."
        };

    }

};

export const verifyOTP = async (data) => {

    const connection = await pool.getConnection();

    try {

        const { email, otp } = data;

        // Find pending registration
        const pendingRegistration =
            await authRepository.findPendingRegistrationByEmail(email);

        if (!pendingRegistration) {
            return {
                success: false,
                message: "Pending registration not found."
            };
        }

        // Verify OTP
        if (pendingRegistration.otp_code !== otp) {
            return {
                success: false,
                message: "Invalid OTP."
            };
        }

        // Check expiry
        if (new Date() > new Date(pendingRegistration.otp_expires_at)) {
            return {
                success: false,
                message: "OTP has expired."
            };
        }

        // Begin transaction
        await connection.beginTransaction();

        const company_id = uuidv4();
        const user_id = uuidv4();

        // Company object
        const companyData = {
            company_id,
            company_name: pendingRegistration.company_name,
            email: pendingRegistration.email,
            phone: pendingRegistration.phone
        };

        // Super Admin object
        const userData = {
            user_id,
            company_id,
            name: pendingRegistration.admin_name,
            email: pendingRegistration.email,
            password_hash: pendingRegistration.password_hash,
            role: "SUPER_ADMIN"
        };

        // Create company
        await authRepository.createCompany(
            connection,
            companyData
        );

        // Create super admin
        await authRepository.createUser(
            connection,
            userData
        );

        // Delete pending registration
        await authRepository.deletePendingRegistration(
            connection,
            pendingRegistration.pending_registration_id
        );

        // Commit
        await connection.commit();

        return {
            success: true,
            message: "Email verified successfully."
        };

    } catch (error) {

        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Rollback Error:", rollbackError);
        }

        console.error("Verify OTP Error:", error);

        return {
            success: false,
            message: "Failed to verify OTP."
        };

    } finally {

        connection.release();

    }

};

export const login = async (data) => {

    try {       

        const { email, password } = data;

        // Find user
        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            return {
                success: false,
                message: "Invalid email or password."
            };
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid email or password."
            };
        }


        return {
            success: true,
            message: "Login successful.",
            token
        };
    } catch (error) {
        console.error("Login Error:", error);
        return {
            success: false,
            message: "Failed to login."
        };
    }
};



