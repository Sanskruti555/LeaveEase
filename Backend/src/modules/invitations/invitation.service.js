import crypto from "crypto";

import * as invitationRepository from "./invitation.repository.js";

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

         // If inviter is MANAGER, manager was already assigned automatically
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

        return {
            success: true,
            message: "Invitation created successfully.",
            data: {
                invitation_id,
                invitation_token,
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