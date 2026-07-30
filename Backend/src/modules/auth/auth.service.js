import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import pool from "../../config/db.js";
import * as authRepository from "./auth.repository.js";

import { sendOTPEmail } from "../../utils/email.js";
import { generateOTP} from "../../utils/otp.js";


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

       

        // Company object
       const companyData = {
    company_name: pendingRegistration.company_name,
    email: pendingRegistration.email,
    phone: pendingRegistration.phone
};

        // Super Admin object
       const userData = {
    company_id,
    name: pendingRegistration.admin_name,
    email: pendingRegistration.email,
    password_hash: pendingRegistration.password_hash,
    role: "SUPER_ADMIN"
};

        // Create company
      const company_id = await authRepository.createCompany(
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
       
        const token = generateToken({
            user_id: user.user_id,
            company_id: user.company_id,
            role: user.role
        });

        return {
            success: true,
            message: "Login successful.",
            token,
            user: {
                user_id: user.user_id,
                company_id: user.company_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    } catch (error) {
        console.error("Login Error:", error);
        return {
            success: false,
            message: "Failed to login."
        };
    }
};

export const resendOTP = async (data) => {

    try {
        const { email } = data;

        // Find pending registration
        const pendingRegistration =
            await authRepository.findPendingRegistrationByEmail(email);

        if (!pendingRegistration) {
            return {
                success: false,
                message: "Pending registration not found."
            };
        }
        // Generate new OTP
        const newOTP = generateOTP();
        const newExpiry = getOTPExpiry();

        // Update pending registration
        await authRepository.updatePendingRegistrationOTP(
            email,
            newOTP,
            newExpiry
        );


        // Send new OTP
        await sendOTPEmail(email, newOTP);

        return {
            success: true,
            message: "OTP resent successfully."
        };
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return {
            success: false,
            message: "Failed to resend OTP."
        };
    }

};

export const forgotPassword = async (data) => {

    try {
        const { email } = data;
        // Find user
        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            return {
                success: false,
                message: "User not found."
            };
        }
        // Generate OTP
        const otp_code = generateOTP();
        const otp_expires_at = getOTPExpiry();

        // Update user with OTP
        await authRepository.updateUserOTP(
            email,
            otp_code,
            otp_expires_at
        );

        // Send OTP
        await sendOTPEmail(email, otp_code);

        return {
            success: true,
            message: "OTP sent successfully."
        };
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return {    
        success: false,
        message: "Failed to process forgot password request."
    };
    }
};

export const resetPassword = async (data) => {

    try {
        const { email, otp, new_password } = data;

        // Find user
        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            return {
                success: false,
                message: "User not found."
            };
        }
        // Verify OTP
        if (user.otp_code !== otp) {
            return {
                success: false,
                message: "Invalid OTP."
            };
        }
        // Check expiry
        if (new Date() > new Date(user.otp_expires_at)) {
            return {
                success: false,
                message: "OTP has expired."
            };
        }
        // Hash new password
        const new_password_hash = await bcrypt.hash(new_password, 10);

        // Update password and clear OTP
        await authRepository.updateUserPassword(
            email,
            new_password_hash
        );

        return {
            success: true,
            message: "Password reset successfully."
        };
    } catch (error) {
        console.error("Reset Password Error:", error);
        return {
            success: false,
            message: "Failed to reset password."
        };
    }
};

export const changePassword = async (userId, data) => {

    try {
        const { current_password, new_password } = data;

        // Find user
        const user = await authRepository.findUserById(userId);

        if (!user) {
            return {
                success: false,
                message: "User not found."
            };
        }   

        // Compare current password
        const isCurrentPasswordValid = await bcrypt.compare(current_password, user.password_hash);

        if (!isCurrentPasswordValid) {
            return {
                success: false,
                message: "Current password is incorrect."
            };
        }
   
        if (current_password === new_password) {
            return {
                success: false,
                message: "New password cannot be the same as the current password."
            };
        }


        // Hash new password
        const new_password_hash = await bcrypt.hash(new_password, 10);

        // Update password
        await authRepository.updateUserPasswordById(
            userId,
            new_password_hash
        );

        return {
            success: true,
            message: "Password changed successfully."
        };
    } catch (error) {
        console.error("Change Password Error:", error);
        return {    
        success: false,
        message: "Failed to change password."
    };
    }
};

export const updateProfile = async (userId, data) => {

    try {
        const { name, phone } = data;

        // Find user
        const user = await authRepository.findUserById(userId);

        if (!user) {
            return {
                success: false,
                message: "User not found."
            };
        }

        const existingPhone = await authRepository.findUserByPhone(phone);

        if (existingPhone && existingPhone.user_id !== userId) {
            return {
                success: false,
                message: "Phone number is already in use."
            };
        }

        // Update profile
        await authRepository.updateUserProfile(
            userId,
            name,
            phone
        );

        return {
            success: true,
            message: "Profile updated successfully."
        };
    } catch (error) {
        console.error("Update Profile Error:", error);
        return {
            success: false,
            message: "Failed to update profile."
        };
    }
};

export const getProfile = async (userId) => {   

    try {
        // Find user
        const user = await authRepository.findUserById(userId);

        if (!user) {
            return {
                success: false,
                message: "User not found."
            };
        }

        return {
            success: true,
            message: "Profile retrieved successfully.",
            data: user
        };
    } catch (error) {
        console.error("Get Profile Error:", error);
        return {
            success: false,
            message: "Failed to retrieve profile."
        };
    }
};

  

