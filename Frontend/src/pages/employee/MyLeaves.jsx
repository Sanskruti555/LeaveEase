import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Calendar,
    CalendarPlus,
    Clock,
    CheckCircle2,
    XCircle,
    Ban,
    Filter,
    Search,
    AlertCircle,
    Info
} from "lucide-react";
import { leaveApi } from "../../api/leave.api";
import { useToast } from "../../context/ToastContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Table } from "../../components/common/Table";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { formatDate, formatDateTime, formatDuration } from "../../utils/formatters";

export const MyLeaves = () => {
    const { addToast } = useToast();

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filtering
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    // Selected Leave Modal
    const [selectedLeave, setSelectedLeave] = useState(null);

    // Cancel Dialog State
    const [leaveToCancel, setLeaveToCancel] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const fetchMyLeaves = async () => {
        try {
            setLoading(true);
            const res = await leaveApi.getMyLeaves();
            if (res.success && Array.isArray(res.data)) {
                setLeaves(res.data);
            }
        } catch (err) {
            console.error("Fetch My Leaves Error:", err);
            setError(err.message || "Failed to load your leave history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    const handleCancelLeave = async () => {
        if (!leaveToCancel) return;

        try {
            setCancelling(true);
            const res = await leaveApi.cancelLeave(leaveToCancel.request_id);
            if (res.success) {
                addToast("Leave request cancelled successfully.", "info");
                setLeaveToCancel(null);
                fetchMyLeaves();
            }
        } catch (err) {
            console.error("Cancel Leave Error:", err);
            addToast(err.message || "Failed to cancel leave request.", "error");
        } finally {
            setCancelling(false);
        }
    };

    // Filtered list
    const filteredLeaves = leaves.filter((item) => {
        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
        const matchesSearch =
            !searchTerm ||
            item.leave_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.reason?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const columns = [
        {
            header: "Leave Type",
            accessor: "leave_type",
            render: (val) => <strong style={{ color: "var(--gray-900)" }}>{val}</strong>
        },
        {
            header: "Date Range",
            accessor: "start_date",
            render: (_, row) => (
                <div>
                    <span style={{ fontSize: "0.8125rem", color: "var(--gray-900)", fontWeight: 600 }}>
                        {formatDate(row.start_date)}
                        {row.start_date !== row.end_date ? ` - ${formatDate(row.end_date)}` : ""}
                    </span>
                    <span style={{ display: "block", fontSize: "0.6875rem", color: "var(--gray-400)" }}>
                        {row.duration_type === "HALF_DAY" ? "Half Day (0.5d)" : "Full Day"}
                    </span>
                </div>
            )
        },
        {
            header: "Reason",
            accessor: "reason",
            render: (val) => (
                <span
                    style={{
                        display: "block",
                        maxWidth: "240px",
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
        },
        {
            header: "Applied On",
            accessor: "created_at",
            render: (val) => (
                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                    {formatDate(val)}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            align: "right",
            render: (_, row) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLeave(row);
                        }}
                    >
                        Details
                    </Button>
                    {row.status === "PENDING" && (
                        <Button
                            variant="outline"
                            size="sm"
                            style={{ color: "var(--danger-600)", borderColor: "var(--danger-200)" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setLeaveToCancel(row);
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                        My Leave Requests
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        View, search, and manage all your past and pending leave applications
                    </p>
                </div>

                <Link to="/employee/apply-leave">
                    <Button variant="primary" leftIcon={<CalendarPlus size={18} />}>
                        Apply New Leave
                    </Button>
                </Link>
            </div>

            {/* Filter Card */}
            <Card style={{ padding: "1rem 1.25rem" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1rem"
                    }}
                >
                    <div style={{ width: "260px" }}>
                        <Input
                            placeholder="Search by leave type or reason..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<Search size={16} />}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "0.8125rem", color: "var(--gray-500)", fontWeight: 600 }}>
                            Status:
                        </span>
                        <div style={{ width: "160px" }}>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="CANCELLED">Cancelled</option>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Table Card */}
            <Card style={{ padding: "0" }}>
                <Table
                    columns={columns}
                    data={filteredLeaves}
                    loading={loading}
                    emptyMessage="No leave requests found"
                    emptyDescription="You don't have any leave requests matching the selected filter."
                    onRowClick={(row) => setSelectedLeave(row)}
                />
            </Card>

            {/* Leave Details Modal */}
            {selectedLeave && (
                <Modal
                    isOpen={!!selectedLeave}
                    onClose={() => setSelectedLeave(null)}
                    title="Leave Request Details"
                    maxWidth="500px"
                    footer={
                        <>
                            {selectedLeave.status === "PENDING" && (
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setLeaveToCancel(selectedLeave);
                                        setSelectedLeave(null);
                                    }}
                                >
                                    Cancel Request
                                </Button>
                            )}
                            <Button variant="primary" onClick={() => setSelectedLeave(null)}>
                                Close
                            </Button>
                        </>
                    }
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.75rem 1rem",
                                backgroundColor: "var(--gray-50)",
                                borderRadius: "var(--radius-md)"
                            }}
                        >
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                                    Request ID: #{selectedLeave.request_id}
                                </span>
                                <h4 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--gray-900)" }}>
                                    {selectedLeave.leave_type}
                                </h4>
                            </div>
                            <Badge status={selectedLeave.status}>{selectedLeave.status}</Badge>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                                    Date Range:
                                </span>
                                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-900)", marginTop: "0.125rem" }}>
                                    {formatDate(selectedLeave.start_date)} - {formatDate(selectedLeave.end_date)}
                                </p>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                                    Duration:
                                </span>
                                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-900)", marginTop: "0.125rem" }}>
                                    {selectedLeave.duration_type === "HALF_DAY" ? "Half Day (0.5d)" : "Full Day"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                                Reason:
                            </span>
                            <p
                                style={{
                                    fontSize: "0.875rem",
                                    color: "var(--gray-800)",
                                    marginTop: "0.25rem",
                                    padding: "0.75rem",
                                    backgroundColor: "var(--gray-50)",
                                    borderRadius: "var(--radius-md)",
                                    lineHeight: 1.5
                                }}
                            >
                                {selectedLeave.reason}
                            </p>
                        </div>

                        {selectedLeave.status === "REJECTED" && selectedLeave.rejection_reason && (
                            <div
                                style={{
                                    padding: "0.875rem",
                                    backgroundColor: "var(--danger-50)",
                                    border: "1px solid var(--danger-100)",
                                    borderRadius: "var(--radius-md)"
                                }}
                            >
                                <span style={{ fontSize: "0.75rem", color: "var(--danger-700)", fontWeight: 700 }}>
                                    Manager Rejection Reason:
                                </span>
                                <p style={{ fontSize: "0.875rem", color: "var(--danger-800)", marginTop: "0.25rem" }}>
                                    {selectedLeave.rejection_reason}
                                </p>
                            </div>
                        )}

                        {selectedLeave.status === "APPROVED" && selectedLeave.approved_at && (
                            <div
                                style={{
                                    padding: "0.75rem",
                                    backgroundColor: "var(--success-50)",
                                    border: "1px solid var(--success-100)",
                                    borderRadius: "var(--radius-md)",
                                    fontSize: "0.8125rem",
                                    color: "var(--success-700)"
                                }}
                            >
                                Approved on {formatDateTime(selectedLeave.approved_at)}
                            </div>
                        )}

                        <div style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>
                            Submitted on {formatDateTime(selectedLeave.created_at)}
                        </div>
                    </div>
                </Modal>
            )}

            {/* Cancel Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!leaveToCancel}
                onClose={() => setLeaveToCancel(null)}
                onConfirm={handleCancelLeave}
                title="Cancel Leave Request?"
                message={`Are you sure you want to cancel your ${leaveToCancel?.leave_type} request for ${formatDate(leaveToCancel?.start_date)}?`}
                confirmText="Yes, Cancel Leave"
                cancelText="Keep Request"
                variant="danger"
                loading={cancelling}
            />
        </div>
    );
};
