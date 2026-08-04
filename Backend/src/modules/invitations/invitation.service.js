import crypto from "crypto";
import bcrypt from "bcrypt";
import pool from "../../config/db.js";

import * as invitationRepository from "./invitation.repository.js";
import { sendInvitationEmail } from "../../utils/mail.js";

export const createInvitation = async (inviter, data) => {
    try {
        const {
        email,
        role,
        branch_id,
        manager_id
        } = data;

        const {
            user_id: invited_by,
            company_id,
            role: inviterRole
        } = inviter;

        const invitationPermissions = {
            SUPER_ADMIN: [
                "BRANCH_ADMIN",
                "MANAGER",
                "EMPLOYEE"
            ],
            BRANCH_ADMIN: [
                "MANAGER",
                "EMPLOYEE"
            ],
            MANAGER: [
                "EMPLOYEE"
            ],
            EMPLOYEE: []
        };

        const allowedRoles =
            invitationPermissions[inviterRole] || [];

        if (!allowedRoles.includes(role)) {
            return {
                success: false,
                message: "You are not allowed to invite this role."
            };
        }

        // Get inviter from database
        const inviterUser =
            await invitationRepository.findUserById(invited_by);

        if (!inviterUser) {
            return {
                success: false,
                message: "Inviting user not found."
            };
        }

        // Extra tenant safety check
        if (inviterUser.company_id !== company_id) {
            return {
                success: false,
                message: "Invalid company access."
            };
        }

        let assignedBranchId = null;
        let assignedManagerId = null;

        // SUPER_ADMIN chooses branch
        if (inviterRole === "SUPER_ADMIN") {

            if (!branch_id) {
                return {
                    success: false,
                    message: "Branch is required for this invitation."
                };
            }

            const branch =
                await invitationRepository.findBranchById(branch_id);

            if (!branch) {
                return {
                    success: false,
                    message: "Branch not found."
                };
            }

            if (branch.company_id !== company_id) {
                return {
                    success: false,
                    message: "Branch does not belong to your company."
                };
            }

            if (branch.status !== "ACTIVE") {
                return {
                    success: false,
                    message: "Cannot invite users to an inactive branch."
                };
            }

            assignedBranchId = branch.branch_id;
        }

        // BRANCH_ADMIN can only invite into own branch
        else if (inviterRole === "BRANCH_ADMIN") {

            if (!inviterUser.branch_id) {
                return {
                    success: false,
                    message: "Branch admin is not assigned to a branch."
                };
            }

            assignedBranchId = inviterUser.branch_id;
        }

        // MANAGER can only invite employees into own branch
        else if (inviterRole === "MANAGER") {

            if (!inviterUser.branch_id) {
                return {
                    success: false,
                    message: "Manager is not assigned to a branch."
                };
            }

            assignedBranchId = inviterUser.branch_id;
            assignedManagerId = inviterUser.user_id;
        }

        // Employee must have a manager
        if (role === "EMPLOYEE") {

         // Manager automatically becomes employee's manager
        if (inviterRole === "MANAGER") {
         assignedManagerId = inviterUser.user_id;
        }

        // SUPER_ADMIN / BRANCH_ADMIN must provide manager_id
       else {

        if (!manager_id) {
            return {
                success: false,
                message: "Manager is required for employee invitation."
            };
        }

        const manager =
            await invitationRepository.findManagerById(manager_id);

        if (!manager) {
            return {
                success: false,
                message: "Manager not found."
            };
        }

        // Manager must belong to same company
        if (manager.company_id !== company_id) {
            return {
                success: false,
                message: "Manager does not belong to your company."
            };
        }

        // Manager must belong to same branch
        if (manager.branch_id !== assignedBranchId) {
            return {
                success: false,
                message: "Manager does not belong to the selected branch."
            };
        }

        if (manager.status !== "ACTIVE") {
            return {
                success: false,
                message: "Cannot assign employee to an inactive manager."
            };
        }

        assignedManagerId = manager.user_id;
    }
}
        // Check whether email already belongs to a user
        const existingUser =
            await invitationRepository.findUserByEmail(email);

        if (existingUser) {
            return {
                success: false,
                message: "A user with this email already exists."
            };
        }

        // Check existing pending invitation
        const existingInvitation =
            await invitationRepository.findPendingInvitationByEmail(
                company_id,
                email
            );

        if (existingInvitation) {
            return {
                success: false,
                message: "A pending invitation already exists for this email."
            };
        }

        const invitation_token =
            crypto.randomBytes(32).toString("hex");

        const expires_at =
            new Date(Date.now() + 24 * 60 * 60 * 1000);

        const invitationData = {
            company_id,
            branch_id: assignedBranchId,
            manager_id: assignedManagerId,
            email,
            role,
            invited_by,
            invitation_token,
            expires_at
        };

        const invitation_id =
            await invitationRepository.createInvitation(
                invitationData
            );


        try{
            await sendInvitationEmail(
            email,
            invitation_token,
            role
            );
        } catch (emailError) {
            console.error( "Invitation Email Error:", emailError);

            await invitationRepository.deleteInvitationById(
        invitation_id
    );

            return {
                success: false,
                message: "Failed to send invitation email."
            };
        }

        return {
            success: true,
            message: "Invitation created successfully.",
            data: {
                invitation_id,
                expires_at
            }
        };

    } catch (error) {
        console.error("Create Invitation Error:", error);

        return {
            success: false,
            message: "Failed to create invitation."
        };
    }
};

export const getInvitationByToken = async (token) => {
    try {
        const invitation =
            await invitationRepository.findInvitationByToken(token);

        // Token doesn't exist
        if (!invitation) {
            return {
                success: false,
                message: "Invalid invitation."
            };
        }

        // Invitation already used/cancelled/etc.
        if (invitation.status !== "PENDING") {
            return {
                success: false,
                message: "Invitation is no longer valid."
            };
        }

        // Check expiration
        if (new Date() > new Date(invitation.expires_at)) {
            return {
                success: false,
                message: "Invitation has expired."
            };
        }

        return {
            success: true,
            message: "Invitation is valid.",
            data: {
                email: invitation.email,
                role: invitation.role,
                company_id: invitation.company_id,
                branch_id: invitation.branch_id
            }
        };

    } catch (error) {
        console.error("Get Invitation Error:", error);

        return {
            success: false,
            message: "Failed to retrieve invitation."
        };
    }
};

export const acceptInvitation = async (token, data) => {

    const connection = await pool.getConnection();

    try {
        const {
            name,
            phone,
            password
        } = data;

        // Find invitation using token
        const invitation =
            await invitationRepository.findInvitationByToken(token);

        if (!invitation) {
            return {
                success: false,
                message: "Invalid invitation."
            };
        }

        // Invitation must still be pending
        if (invitation.status !== "PENDING") {
            return {
                success: false,
                message: "Invitation is no longer valid."
            };
        }

        // Check expiry
        if (new Date() > new Date(invitation.expires_at)) {
            return {
                success: false,
                message: "Invitation has expired."
            };
        }

        // Make sure account wasn't already created
        const existingUser =
            await invitationRepository.findUserByEmail(
                invitation.email
            );

        if (existingUser) {
            return {
                success: false,
                message: "A user with this email already exists."
            };
        }

        // Hash password
        const password_hash =
            await bcrypt.hash(password, 10);

        // Start transaction
        await connection.beginTransaction();

        const userData = {
            company_id: invitation.company_id,
            branch_id: invitation.branch_id,
            manager_id: invitation.manager_id,
            created_by: invitation.invited_by,

            name,
            email: invitation.email,
            phone: phone ?? null,

            password_hash,
            role: invitation.role
        };

        // Create actual user
        const user_id =
            await invitationRepository.createInvitedUser(
                connection,
                userData
            );

        // Mark invitation as accepted
        await invitationRepository.markInvitationAccepted(
            connection,
            invitation.invitation_id
        );

        await connection.commit();

        return {
            success: true,
            message: "Invitation accepted successfully.",
            data: {
                user_id,
                email: invitation.email,
                role: invitation.role
            }
        };

    } catch (error) {

        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error(
                "Accept Invitation Rollback Error:",
                rollbackError
            );
        }

        console.error("Accept Invitation Error:", error);

        return {
            success: false,
            message: "Failed to accept invitation."
        };

    } finally {
        connection.release();
    }
};

export const resendInvitation = async (
    inviter,
    invitationId
) => {

    try {

        const {
            user_id,
            company_id,
            role: inviterRole
        } = inviter;

        // Find invitation
        const invitation =
            await invitationRepository.findInvitationById(
                invitationId
            );

        if (!invitation) {
            return {
                success: false,
                message: "Invitation not found."
            };
        }

        // Tenant protection
        if (invitation.company_id !== company_id) {
            return {
                success: false,
                message: "You are not allowed to access this invitation."
            };
        }

        // Only pending invitations can be resent
        if (invitation.status !== "PENDING") {
            return {
                success: false,
                message: "Only pending invitations can be resent."
            };
        }

        // Permission check
        const invitationPermissions = {
            SUPER_ADMIN: [
                "BRANCH_ADMIN",
                "MANAGER",
                "EMPLOYEE"
            ],
            BRANCH_ADMIN: [
                "MANAGER",
                "EMPLOYEE"
            ],
            MANAGER: [
                "EMPLOYEE"
            ],
            EMPLOYEE: []
        };

        const allowedRoles =
            invitationPermissions[inviterRole] || [];

        if (!allowedRoles.includes(invitation.role)) {
            return {
                success: false,
                message: "You are not allowed to resend this invitation."
            };
        }

        // Extra restriction:
        // Manager should only resend invitations they created
        if (
            inviterRole === "MANAGER" &&
            invitation.invited_by !== user_id
        ) {
            return {
                success: false,
                message: "You cannot resend this invitation."
            };
        }

        // Generate NEW token
        const newToken =
            crypto.randomBytes(32).toString("hex");

        // New 24-hour expiry
        const newExpiry =
            new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Save old token and expiry in case email sending fails
        const oldToken = invitation.invitation_token;
        const oldExpiry = invitation.expires_at;    

        // Update invitation
        await invitationRepository.updateInvitationToken(
            invitation.invitation_id,
            newToken,
            newExpiry
        );
try{
        // Send new email
        await sendInvitationEmail(
            invitation.email,
            newToken,
            invitation.role
        );
    } catch (emailError) {
        console.error(
            "Resend Invitation Email Error:",
            emailError
        );

         // Restore previous token and expiry
    await invitationRepository.updateInvitationToken(
        invitation.invitation_id,
        oldToken,
        oldExpiry
    );

    return {
        success: false,
        message: "Failed to resend invitation email."
    };
}

        return {
            success: true,
            message: "Invitation resent successfully.",
            data: {
                invitation_id: invitation.invitation_id,
                expires_at: newExpiry
            }
        };

    } catch (error) {

        console.error(
            "Resend Invitation Error:",
            error
        );

        return {
            success: false,
            message: "Failed to resend invitation."
        };
    }
};

export const cancelInvitation = async (
    inviter,
    invitationId
) => {
    try {
        const {
            user_id,
            company_id,
            role: inviterRole
        } = inviter;

        const invitation =
            await invitationRepository.findInvitationById(
                invitationId
            );

        if (!invitation) {
            return {
                success: false,
                message: "Invitation not found."
            };
        }

        // Company isolation
        if (invitation.company_id !== company_id) {
            return {
                success: false,
                message: "You are not allowed to access this invitation."
            };
        }

        // Only pending invitation can be cancelled
        if (invitation.status !== "PENDING") {
            return {
                success: false,
                message: "Only pending invitations can be cancelled."
            };
        }

        const invitationPermissions = {
            SUPER_ADMIN: [
                "BRANCH_ADMIN",
                "MANAGER",
                "EMPLOYEE"
            ],
            BRANCH_ADMIN: [
                "MANAGER",
                "EMPLOYEE"
            ],
            MANAGER: [
                "EMPLOYEE"
            ],
            EMPLOYEE: []
        };

        const allowedRoles =
            invitationPermissions[inviterRole] || [];

        if (!allowedRoles.includes(invitation.role)) {
            return {
                success: false,
                message: "You are not allowed to cancel this invitation."
            };
        }

        // Managers can cancel only invitations they created
        if (
            inviterRole === "MANAGER" &&
            invitation.invited_by !== user_id
        ) {
            return {
                success: false,
                message: "You cannot cancel this invitation."
            };
        }

        await invitationRepository.cancelInvitation(
            invitation.invitation_id
        );

        return {
            success: true,
            message: "Invitation cancelled successfully."
        };

    } catch (error) {
        console.error("Cancel Invitation Error:", error);

        return {
            success: false,
            message: "Failed to cancel invitation."
        };
    }
};