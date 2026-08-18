import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    CalendarPlus,
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    PieChart,
    ArrowRight,
    TrendingUp,
    FileText,
    AlertCircle
} from "lucide-react";
import { dashboardApi } from "../../api/dashboard.api";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Skeleton } from "../../components/common/Skeleton";
import { Table } from "../../components/common/Table";
import { formatDate, formatDuration } from "../../utils/formatters";

export const EmployeeDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await dashboardApi.getEmployeeDashboard();
                if (res.success && res.data) {
                    setDashboardData(res.data);
                }
            } catch (err) {
                console.error("Employee Dashboard Error:", err);
                setError(err.message || "Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const leaveBalances = dashboardData?.leave_balances || [];
    const leaveStats = dashboardData?.leaves || {
        total_requests: 0,
        pending_requests: 0,
        approved_requests: 0,
        rejected_requests: 0,
        cancelled_requests: 0
    };
    const recentLeaves = dashboardData?.recent_leaves || [];

    const recentColumns = [
        {
            header: "Leave Type",
            accessor: "leave_type_name",
            render: (val) => <strong style={{ color: "var(--gray-900)" }}>{val}</strong>
        },
        {
            header: "Dates",
            accessor: "start_date",
            render: (_, row) => (
                <span style={{ fontSize: "0.8125rem" }}>
                    {formatDate(row.start_date)}
                    {row.start_date !== row.end_date ? ` - ${formatDate(row.end_date)}` : ""}
                </span>
            )
        },
        {
            header: "Duration",
            accessor: "duration_type",
            render: (val) => (
                <span style={{ fontSize: "0.8125rem", color: "var(--gray-600)" }}>
                    {val === "HALF_DAY" ? "Half Day" : "Full Day"}
                </span>
            )
        },
        {
            header: "Reason",
            accessor: "reason",
            render: (val) => (
                <span
                    style={{
                        display: "block",
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.8125rem"
                    }}
                    title={val}
                >
                    {val}
                </span>
            )
        },
        {
            header: "Status",
            accessor: "status",
            render: (val) => <Badge status={val}>{val}</Badge>
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
                    <Skeleton height="200px" />
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
            {/* Quick Action Top Bar */}
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
                        My Leave Overview
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        Track your balances, submit new time-off requests, and view application status
                    </p>
                </div>

                <Link to="/employee/apply-leave">
                    <Button variant="primary" size="md" leftIcon={<CalendarPlus size={18} />}>
                        Apply for Leave
                    </Button>
                </Link>
            </div>

            {/* Leave Stat Metric Cards */}
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
                            Total Requests
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
                            <Calendar size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--gray-900)", marginTop: "0.5rem" }}>
                        {leaveStats.total_requests}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem", display: "block" }}>
                        Lifetime submissions
                    </span>
                </Card>

                <Card style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--warning-700)" }}>
                            Pending Approval
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
                        Awaiting manager action
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
                        Confirmed time off
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
                        Declined by manager
                    </span>
                </Card>
            </div>

            {/* Leave Balance Breakdown */}
            <div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1rem"
                    }}
                >
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--gray-900)" }}>
                        Current Leave Balances
                    </h3>
                    <Link
                        to="/employee/balances"
                        style={{
                            fontSize: "0.8125rem",
                            color: "var(--primary-600)",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            textDecoration: "none"
                        }}
                    >
                        <span>View Details</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "1rem"
                    }}
                >
                    {leaveBalances.length === 0 ? (
                        <Card style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
                            <PieChart size={32} style={{ color: "var(--gray-400)", margin: "0 auto 0.5rem" }} />
                            <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                                No active leave balances allocated yet.
                            </p>
                        </Card>
                    ) : (
                        leaveBalances.map((bal) => {
                            const remaining = Number(bal.remaining_balance) || 0;
                            const used = Number(bal.used_balance) || 0;
                            const allocated = Number(bal.allocated_balance) || 1;
                            const percentage = Math.min(100, Math.round((used / allocated) * 100));

                            return (
                                <Card key={bal.leave_type_id} style={{ padding: "1.25rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gray-900)" }}>
                                                {bal.leave_type_name}
                                            </h4>
                                            <span style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>
                                                Valid: {formatDate(bal.cycle_start_date)} - {formatDate(bal.cycle_end_date)}
                                            </span>
                                        </div>
                                        <Badge status={remaining > 0 ? "ACTIVE" : "INACTIVE"}>
                                            {remaining > 0 ? "Available" : "Exhausted"}
                                        </Badge>
                                    </div>

                                    <div style={{ marginTop: "1rem", display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                                        <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-700)" }}>
                                            {remaining}
                                        </span>
                                        <span style={{ fontSize: "0.875rem", color: "var(--gray-500)", fontWeight: 500 }}>
                                            / {allocated} days left
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "6px",
                                            backgroundColor: "var(--gray-100)",
                                            borderRadius: "var(--radius-full)",
                                            marginTop: "0.75rem",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${percentage}%`,
                                                height: "100%",
                                                backgroundColor:
                                                    percentage > 85
                                                        ? "var(--danger-500)"
                                                        : percentage > 50
                                                        ? "var(--warning-500)"
                                                        : "var(--primary-600)",
                                                borderRadius: "var(--radius-full)",
                                                transition: "width 0.4s ease"
                                            }}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginTop: "0.5rem",
                                            fontSize: "0.75rem",
                                            color: "var(--gray-500)"
                                        }}
                                    >
                                        <span>Used: {used}d</span>
                                        <span>{percentage}% used</span>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Recent Leave Requests */}
            <Card
                title="Recent Leave Requests"
                subtitle="Your most recent leave submissions"
                action={
                    <Link to="/employee/my-leaves" style={{ textDecoration: "none" }}>
                        <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                            View All Leaves
                        </Button>
                    </Link>
                }
                style={{ padding: "0" }}
            >
                <Table
                    columns={recentColumns}
                    data={recentLeaves}
                    emptyMessage="No leave requests yet"
                    emptyDescription="You haven't submitted any leave requests so far."
                />
            </Card>
        </div>
    );
};
