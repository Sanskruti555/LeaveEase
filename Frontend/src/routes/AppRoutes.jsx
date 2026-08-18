import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layouts
import { AuthLayout } from "../layouts/AuthLayout";
import { AppLayout } from "../layouts/AppLayout";

// Guards
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";


// Auth Pages
import { Login } from "../pages/auth/Login";
import { RegisterCompany } from "../pages/auth/RegisterCompany";
import { VerifyOtp } from "../pages/auth/VerifyOtp";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { AcceptInvitation } from "../pages/auth/AcceptInvitation";

// Common Pages
import { Profile } from "../pages/common/Profile";
import { NotFound } from "../pages/common/NotFound";
import { Unauthorized } from "../pages/common/Unauthorized";

// Employee Pages
import { EmployeeDashboard } from "../pages/employee/EmployeeDashboard";
import { ApplyLeave } from "../pages/employee/ApplyLeave";
import { MyLeaves } from "../pages/employee/MyLeaves";
import { LeaveBalances } from "../pages/employee/LeaveBalances";

// Manager Pages
import { ManagerDashboard } from "../pages/manager/ManagerDashboard";
import { TeamLeaveRequests } from "../pages/manager/TeamLeaveRequests";
import { TeamMembers } from "../pages/manager/TeamMembers";
import { InviteEmployee } from "../pages/manager/InviteEmployee";

// Branch Admin Pages
import { BranchAdminDashboard } from "../pages/branchAdmin/BranchAdminDashboard";
import { BranchUsers } from "../pages/branchAdmin/BranchUsers";
import { BranchInvitations } from "../pages/branchAdmin/BranchInvitations";

// Super Admin Pages
import { SuperAdminDashboard } from "../pages/superAdmin/SuperAdminDashboard";
import { BranchesManagement } from "../pages/superAdmin/BranchesManagement";
import { LeaveTypesManagement } from "../pages/superAdmin/LeaveTypesManagement";
import { CompanyUsers } from "../pages/superAdmin/CompanyUsers";
import { CompanyInvitations } from "../pages/superAdmin/CompanyInvitations";

// Helper component for Root Redirect
const RootRedirect = () => {
    const {
        isAuthenticated,
        role,
        loading,
        getDashboardPathForRole
    } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Navigate
            to={getDashboardPathForRole(role)}
            replace
        />
    );
};

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Root Dispatcher */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public Authentication Pages */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterCompany />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
            </Route>

            {/* Protected App Layout */}
            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                {/* Common Protected Profile */}
                <Route path="/profile" element={<Profile />} />

                {/* Employee Routes */}
                <Route element={<RoleRoute allowedRoles={["EMPLOYEE"]} />}>
                    <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                    <Route path="/employee/apply-leave" element={<ApplyLeave />} />
                    <Route path="/employee/my-leaves" element={<MyLeaves />} />
                    <Route path="/employee/balances" element={<LeaveBalances />} />
                </Route>

                {/* Manager Routes */}
                <Route element={<RoleRoute allowedRoles={["MANAGER"]} />}>
                    <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                    <Route path="/manager/leave-requests" element={<TeamLeaveRequests />} />
                    <Route path="/manager/team" element={<TeamMembers />} />
                    <Route path="/manager/invite" element={<InviteEmployee />} />
                    <Route path="/manager/leave-types" element={<LeaveTypesManagement />} />
                </Route>

                {/* Branch Admin Routes */}
                <Route element={<RoleRoute allowedRoles={["BRANCH_ADMIN"]} />}>
                    <Route path="/branch/dashboard" element={<BranchAdminDashboard />} />
                    <Route path="/branch/users" element={<BranchUsers />} />
                    <Route path="/branch/invitations" element={<BranchInvitations />} />
                    <Route path="/branch/leave-types" element={<LeaveTypesManagement />} />
                </Route>

                {/* Super Admin Routes */}
                <Route element={<RoleRoute allowedRoles={["SUPER_ADMIN"]} />}>
                    <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
                    <Route path="/admin/branches" element={<BranchesManagement />} />
                    <Route path="/admin/leave-types" element={<LeaveTypesManagement />} />
                    <Route path="/admin/users" element={<CompanyUsers />} />
                    <Route path="/admin/invitations" element={<CompanyInvitations />} />
                </Route>
            </Route>

            {/* Error Pages */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
