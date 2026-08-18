import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    ArrowRight,
    UserPlus,
    CheckSquare,
    AlertCircle,
    FileText
} from "lucide-react";
import { dashboardApi } from "../../api/dashboard.api";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Skeleton } from "../../components/common/Skeleton";
import { Table } from "../../components/common/Table";
import { formatDate } from "../../utils/formatters";

export const ManagerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await dashboardApi.getManagerDashboard();
                if (res.success && res.data) {
                    setDashboardData(res.data);
                }
            } catch (err) {
                console.error("Manager Dashboard Error:", err);
                setError(err.message || "Failed to load manager dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const userStats = dashboardData?.users || { total_employees: 0 };
    const leaveStats = dashboardData?.leaves || {
        total_requests: 0,
        pending_requests: 0,
        approved_requests: 0,
        rejected_requests: 0,
        cancelled_requests: 0
    };
    const teamBalances = dashboardData?.leave_balances || [];

    const balanceColumns = [
        {
            header: "Employee",
            accessor: "name",
            render: (val, row) => (
                <div>
                    <strong style={{ color: "var(--gray-900)" }}>{val}</strong>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)" }}>
                        {row.email}
                    </span>
                </div>
            )
        },
        {
            header: "Leave Type",
            accessor: "leave_type_name",
            render: (val) => <strong style={{ color: "var(--primary-700)" }}>{val}</strong>
        },
        {
            header: "Allocated",
            accessor: "allocated_balance",
            render: (val) => `${val}d`
        },
        {
            header: "Used",
            accessor: "used_balance",
            render: (val) => `${val}d`
        },
        {
            header: "Remaining",
            accessor: "remaining_balance",
            render: (val) => (
                <span style={{ fontWeight: 700, color: val > 0 ? "var(--success-700)" : "var(--danger-700)" }}>
                    {val} days
                </span>
            )
        },
        {
            header: "Cycle End",
            accessor: "cycle_end_date",
            render: (val) => formatDate(val)
        }
    ];

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
                <Card>
                    <Skeleton height="250px" />
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <Card style={{ textAlign: "center", padding: "2rem" }}>
                <AlertCircle size={32} style={{ color: "var(--danger-600)", margin: "0 auto 0.75rem" }} />
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--gray-900)" }}>
                    Failed to Load Dashboard
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
            {/* Header / Actions */}
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
                        Team Management Dashboard
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        Manage your team's leave requests, approve applications, and track balances
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Link to="/manager/invite">
                        <Button variant="outline" leftIcon={<UserPlus size={16} />}>
                            Invite Employee
                        </Button>
                    </Link>
                    <Link to="/manager/leave-requests">
                        <Button variant="primary" leftIcon={<CheckSquare size={18} />}>
                            Review Requests ({leaveStats.pending_requests})
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
                            Direct Employees
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
                        {userStats.total_employees}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem", display: "block" }}>
                        Active team members
                    </span>
                </Card>

                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--warning-700)" }}>
                            Pending Approvals
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
                        Requires your review
                    </span>
                </Card>

                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--success-700)" }}>
                            Approved Requests
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
                        Approved by you
                    </span>
                </Card>

                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--danger-700)" }}>
                            Rejected Requests
                        </span>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--danger-50)",
                                color: "var(--danger-600)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <XCircle size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--danger-700)", marginTop: "0.5rem" }}>
                        {leaveStats.rejected_requests}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem", display: "block" }}>
                        Declined requests
                    </span>
                </Card>
            </div>

            {/* Team Leave Balances Table */}
            <Card
                title="Team Member Leave Balances"
                subtitle="Live overview of leave allocations and remaining days for your direct team"
                action={
                    <Link to="/manager/team" style={{ textDecoration: "none" }}>
                        <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                            Manage Team
                        </Button>
                    </Link>
                }
                style={{ padding: "0" }}
            >
                <Table
                    columns={balanceColumns}
                    data={teamBalances}
                    emptyMessage="No team balances available"
                    emptyDescription="Your assigned employees do not have active leave balances yet."
                />
            </Card>
        </div>
    );
};
