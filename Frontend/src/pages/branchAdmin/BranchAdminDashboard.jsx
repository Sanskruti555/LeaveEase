import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    Layers,
    Mail,
    UserPlus,
    Building2,
    AlertCircle,
    ArrowRight
} from "lucide-react";
import { dashboardApi } from "../../api/dashboard.api";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Skeleton } from "../../components/common/Skeleton";

export const BranchAdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await dashboardApi.getBranchAdminDashboard();
                if (res.success && res.data) {
                    setDashboardData(res.data);
                }
            } catch (err) {
                console.error("Branch Admin Dashboard Error:", err);
                setError(err.message || "Failed to load branch dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const userStats = dashboardData?.users || { total_managers: 0, total_employees: 0 };
    const leaveStats = dashboardData?.leaves || {
        total_requests: 0,
        pending_requests: 0,
        approved_requests: 0,
        rejected_requests: 0,
        cancelled_requests: 0
    };
    const invitationStats = dashboardData?.invitations || { pending_invitations: 0 };
    const leaveTypeStats = dashboardData?.leave_types || { total_leave_types: 0, active_leave_types: 0 };

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    {Array.from({ length: 4 }).map((_, i) => (
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
                    Failed to Load Branch Dashboard
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
            {/* Header */}
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
                        Branch Overview
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        Monitor branch staff, leave metrics, and staff invitations
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Link to="/branch/invitations">
                        <Button variant="outline" leftIcon={<Mail size={16} />}>
                            Invitations ({invitationStats.pending_invitations})
                        </Button>
                    </Link>
                    <Link to="/branch/users">
                        <Button variant="primary" leftIcon={<Users size={16} />}>
                            Manage Branch Users
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metric Cards */}
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
                            Branch Managers
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
                            <Users size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--gray-900)", marginTop: "0.5rem" }}>
                        {userStats.total_managers}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem", display: "block" }}>
                        Active branch managers
                    </span>
                </Card>

                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--gray-500)" }}>
                            Branch Employees
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
                        {userStats.total_employees}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem", display: "block" }}>
                        Staff members
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
                        Branch requests pending
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
                        Approved time-offs
                    </span>
                </Card>
            </div>

            {/* Quick Link Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.25rem"
                }}
            >
                <Card
                    title="Branch Users"
                    subtitle="Manage managers and employees assigned to your branch"
                    action={
                        <Link to="/branch/users" style={{ textDecoration: "none" }}>
                            <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                                View Users
                            </Button>
                        </Link>
                    }
                >
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", lineHeight: 1.5 }}>
                        Search, filter, view details, and toggle active status for staff within your branch.
                    </p>
                </Card>

                <Card
                    title="Staff Invitations"
                    subtitle="Invite new Managers and Employees to this branch"
                    action={
                        <Link to="/branch/invitations" style={{ textDecoration: "none" }}>
                            <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                                Manage Invitations
                            </Button>
                        </Link>
                    }
                >
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", lineHeight: 1.5 }}>
                        Send email invites to onboard managers or employees directly into this branch.
                    </p>
                </Card>
            </div>
        </div>
    );
};
