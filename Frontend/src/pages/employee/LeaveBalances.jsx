import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, CalendarPlus, RefreshCw, Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { leaveApi } from "../../api/leave.api";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Skeleton } from "../../components/common/Skeleton";
import { formatDate } from "../../utils/formatters";

export const LeaveBalances = () => {
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBalances = async () => {
        try {
            setLoading(true);
            const res = await leaveApi.getLeaveBalances();
            if (res.success && Array.isArray(res.data)) {
                setBalances(res.data);
            }
        } catch (err) {
            console.error("Fetch Balances Error:", err);
            setError(err.message || "Failed to load leave balances.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalances();
    }, []);

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
                        Leave Balances & Allocations
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        View your allocated, utilized, and remaining balances per leave category
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Button variant="outline" onClick={fetchBalances} leftIcon={<RefreshCw size={16} />}>
                        Refresh
                    </Button>
                    <Link to="/employee/apply-leave">
                        <Button variant="primary" leftIcon={<CalendarPlus size={18} />}>
                            Apply for Leave
                        </Button>
                    </Link>
                </div>
            </div>

            {error && (
                <div
                    style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "var(--danger-50)",
                        border: "1px solid var(--danger-100)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--danger-700)",
                        fontSize: "0.8125rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}
                >
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* Balances Grid */}
            {loading ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "1.25rem"
                    }}
                >
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <Skeleton height="1.5rem" width="60%" style={{ marginBottom: "0.5rem" }} />
                            <Skeleton height="3rem" width="40%" style={{ marginBottom: "1rem" }} />
                            <Skeleton height="8px" width="100%" />
                        </Card>
                    ))}
                </div>
            ) : balances.length === 0 ? (
                <Card style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                    <PieChart size={40} style={{ color: "var(--gray-400)", margin: "0 auto 0.75rem" }} />
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--gray-900)" }}>
                        No Leave Balances Found
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.25rem" }}>
                        Your company has not yet allocated leave cycles for your account.
                    </p>
                </Card>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "1.25rem"
                    }}
                >
                    {balances.map((item) => {
                        const remaining = Number(item.remaining_balance) || 0;
                        const used = Number(item.used_balance) || 0;
                        const allocated = Number(item.allocated_balance) || 1;
                        const percentage = Math.min(100, Math.round((used / allocated) * 100));

                        return (
                            <Card key={item.balance_id} style={{ padding: "1.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--gray-900)" }}>
                                            {item.leave_type}
                                        </h3>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.375rem",
                                                fontSize: "0.75rem",
                                                color: "var(--gray-400)",
                                                marginTop: "0.25rem"
                                            }}
                                        >
                                            <Calendar size={13} />
                                            <span>
                                                Cycle: {formatDate(item.cycle_start_date)} — {formatDate(item.cycle_end_date)}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge status={remaining > 0 ? "ACTIVE" : "INACTIVE"}>
                                        {remaining > 0 ? "Active" : "Exhausted"}
                                    </Badge>
                                </div>

                                {/* Main Balance Metric */}
                                <div style={{ margin: "1.5rem 0 1rem" }}>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                                        <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary-700)", lineHeight: 1 }}>
                                            {remaining}
                                        </span>
                                        <span style={{ fontSize: "1rem", color: "var(--gray-500)", fontWeight: 600 }}>
                                            / {allocated} Days Remaining
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "8px",
                                        backgroundColor: "var(--gray-100)",
                                        borderRadius: "var(--radius-full)",
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

                                {/* Stats Grid */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr",
                                        gap: "0.5rem",
                                        marginTop: "1.25rem",
                                        paddingTop: "1rem",
                                        borderTop: "1px solid var(--border-color)",
                                        textAlign: "center"
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: "0.6875rem", color: "var(--gray-400)", fontWeight: 700, textTransform: "uppercase" }}>
                                            Allocated
                                        </span>
                                        <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gray-800)" }}>
                                            {allocated}d
                                        </p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: "0.6875rem", color: "var(--gray-400)", fontWeight: 700, textTransform: "uppercase" }}>
                                            Used
                                        </span>
                                        <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gray-800)" }}>
                                            {used}d
                                        </p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: "0.6875rem", color: "var(--gray-400)", fontWeight: 700, textTransform: "uppercase" }}>
                                            Remaining
                                        </span>
                                        <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary-700)" }}>
                                            {remaining}d
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
