import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Building2,
    Users,
    Layers,
    Mail,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    Sparkles
} from "lucide-react";
import { dashboardApi } from "../../api/dashboard.api";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Skeleton } from "../../components/common/Skeleton";

export const SuperAdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await dashboardApi.getSuperAdminDashboard();
                if (res.success && res.data) {
                    setDashboardData(res.data);
                }
            } catch (err) {
                console.error("Super Admin Dashboard Error:", err);
                setError(err.message || "Failed to load super admin dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const branchStats = dashboardData?.branches || { total_branches: 0, active_branches: 0, inactive_branches: 0 };
    const userStats = dashboardData?.users || { total_users: 0, branch_admins: 0, managers: 0, employees: 0 };
    const leaveStats = dashboardData?.leaves || {
        total_requests: 0,
        pending_requests: 0,
        approved_requests: 0,
        rejected_requests: 0,
        cancelled_requests: 0
    };
    const leaveTypeStats = dashboardData?.leave_types || { total_leave_types: 0, active_leave_types: 0 };
    const invitationStats = dashboardData?.invitations || { total_invitations: 0, pending_invitations: 0, accepted_invitations: 0 };

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i}>
                            <Skeleton height="2rem" width="40%" style={{ marginBottom: "0.5rem" }} />
                            <Skeleton height="1rem" width="70%" />
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card style={{ textAlign: "center", padding: "2rem" }}>
                <AlertCircle size={32} style={{ color: "var(--danger-600)", margin: "0 auto 0.75rem" }} />
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--gray-900)" }}>
                    Failed to Load Enterprise Dashboard
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.25rem" }}>
                    {error}
                </p>
                <Button variant="primary" onClick={() => window.location.reload()} style={{ marginTop: "1rem" }}>
                    Retry
                </Button>
            </Card>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* Top Bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem"
                }}
            >
                <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gray-900)" }}>
                        Enterprise Overview
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        Organization-wide statistics, branch operational metrics, and leave activity
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Link to="/admin/invitations">
                        <Button variant="outline" leftIcon={<Mail size={16} />}>
                            Send Invitations
                        </Button>
                    </Link>
                    <Link to="/admin/branches">
                        <Button variant="primary" leftIcon={<Building2 size={16} />}>
                            Manage Branches
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metric Top Row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem"
                }}
            >
                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--gray-500)" }}>
                            Total Branches
                        </span>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--primary-50)",
                                color: "var(--primary-600)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Building2 size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--gray-900)", marginTop: "0.5rem" }}>
                        {branchStats.total_branches}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--success-600)", marginTop: "0.25rem", display: "block" }}>
                        {branchStats.active_branches} active locations
                    </span>
                </Card>

                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--gray-500)" }}>
                            Total Personnel
                        </span>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "#e0f2fe",
                                color: "#0284c7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Users size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--gray-900)", marginTop: "0.5rem" }}>
                        {userStats.total_users}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem", display: "block" }}>
                        {userStats.employees} employees, {userStats.managers} managers
                    </span>
                </Card>

                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--warning-700)" }}>
                            Pending Leaves
                        </span>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--warning-50)",
                                color: "var(--warning-600)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Clock size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--warning-700)", marginTop: "0.5rem" }}>
                        {leaveStats.pending_requests}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem", display: "block" }}>
                        Company-wide pending
                    </span>
                </Card>

                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--success-700)" }}>
                            Approved Leaves
                        </span>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--success-50)",
                                color: "var(--success-600)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <CheckCircle2 size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--success-700)", marginTop: "0.5rem" }}>
                        {leaveStats.approved_requests}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem", display: "block" }}>
                        Total approved time off
                    </span>
                </Card>

                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--gray-500)" }}>
                            Leave Types
                        </span>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "#f3e8ff",
                                color: "#9333ea",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Layers size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--gray-900)", marginTop: "0.5rem" }}>
                        {leaveTypeStats.total_leave_types}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem", display: "block" }}>
                        {leaveTypeStats.active_leave_types} active policies
                    </span>
                </Card>
            </div>

            {/* Quick Navigation Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.25rem"
                }}
            >
                <Card
                    title="Company Branches"
                    subtitle="Configure office branches, contact details, and locations"
                    action={
                        <Link to="/admin/branches" style={{ textDecoration: "none" }}>
                            <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                                Manage
                            </Button>
                        </Link>
                    }
                >
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", lineHeight: 1.5 }}>
                        Add new company branches, update existing locations, or toggle operational status.
                    </p>
                </Card>

                <Card
                    title="Leave Types & Policies"
                    subtitle="Manage annual allocations, accrual frequencies, and rules"
                    action={
                        <Link to="/admin/leave-types" style={{ textDecoration: "none" }}>
                            <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                                Manage
                            </Button>
                        </Link>
                    }
                >
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", lineHeight: 1.5 }}>
                        Create custom leave categories such as Casual Leave, Sick Leave, Paid Vacation, and Maternity.
                    </p>
                </Card>

                <Card
                    title="Company Staff & Users"
                    subtitle="View and manage all branch admins, managers, and employees"
                    action={
                        <Link to="/admin/users" style={{ textDecoration: "none" }}>
                            <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                                Manage
                            </Button>
                        </Link>
                    }
                >
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", lineHeight: 1.5 }}>
                        Search and filter all registered users across all branches and manage account statuses.
                    </p>
                </Card>

                <Card
                    title="Invitations Center"
                    subtitle="Invite new Branch Admins, Managers, and Employees"
                    action={
                        <Link to="/admin/invitations" style={{ textDecoration: "none" }}>
                            <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                                Manage
                            </Button>
                        </Link>
                    }
                >
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", lineHeight: 1.5 }}>
                        Generate email invitation links, assign branches and managers, and track onboarding status.
                    </p>
                </Card>
            </div>
        </div>
    );
};
