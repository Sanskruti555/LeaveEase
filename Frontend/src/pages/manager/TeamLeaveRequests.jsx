import React, { useState, useEffect } from "react";
import {
    CheckSquare,
    Check,
    X,
    Clock,
    Search,
    Filter,
    AlertCircle,
    User,
    Calendar,
    FileText,
    CheckCircle2,
    XCircle,
    RefreshCw
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
import { formatDate, formatDateTime } from "../../utils/formatters";

export const TeamLeaveRequests = () => {
    const { addToast } = useToast();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    // Action States
    const [requestToApprove, setRequestToApprove] = useState(null);
    const [approving, setApproving] = useState(false);

    const [requestToReject, setRequestToReject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejecting, setRejecting] = useState(false);
    const [rejectError, setRejectError] = useState("");

    const [selectedDetail, setSelectedDetail] = useState(null);

    const fetchTeamRequests = async () => {
        try {
            setLoading(true);
            const res = await leaveApi.getTeamLeaves();
            if (res.success && Array.isArray(res.data)) {
                setRequests(res.data);
            }
        } catch (err) {
            console.error("Fetch Team Leaves Error:", err);
            setError(err.message || "Failed to load team leave requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamRequests();
    }, []);

    const handleApprove = async () => {
        if (!requestToApprove) return;

        try {
            setApproving(true);
            const res = await leaveApi.approveLeave(requestToApprove.request_id);
            if (res.success) {
                addToast("Leave request approved successfully! Balance has been deducted.", "success");
                setRequestToApprove(null);
                fetchTeamRequests();
            }
        } catch (err) {
            console.error("Approve Leave Error:", err);
            addToast(err.message || "Failed to approve leave request.", "error");
        } finally {
            setApproving(false);
        }
    };

    const handleReject = async (e) => {
        e.preventDefault();
        setRejectError("");

        if (!rejectionReason.trim() || rejectionReason.trim().length < 3) {
            setRejectError("Please provide a rejection reason (minimum 3 characters).");
            return;
        }

        try {
            setRejecting(true);
            const res = await leaveApi.rejectLeave(requestToReject.request_id, {
                rejection_reason: rejectionReason.trim()
            });

            if (res.success) {
                addToast("Leave request has been rejected.", "info");
                setRequestToReject(null);
                setRejectionReason("");
                fetchTeamRequests();
            }
        } catch (err) {
            console.error("Reject Leave Error:", err);
            setRejectError(err.message || "Failed to reject leave request.");
        } finally {
            setRejecting(false);
        }
    };

    const filteredRequests = requests.filter((item) => {
        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
        const matchesSearch =
            !searchTerm ||
            item.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.employee_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.leave_type?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const columns = [
        {
            header: "Employee",
            accessor: "employee_name",
            render: (val, row) => (
                <div>
                    <strong style={{ color: "var(--gray-900)" }}>{val}</strong>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)" }}>
                        {row.employee_email}
                    </span>
                </div>
            )
        },
        {
            header: "Leave Type",
            accessor: "leave_type",
            render: (val) => <strong style={{ color: "var(--primary-700)" }}>{val}</strong>
        },
        {
            header: "Dates & Duration",
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
        },
        {
            header: "Applied",
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.375rem" }}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetail(row);
                        }}
                    >
                        View
                    </Button>

                    {row.status === "PENDING" && (
                        <>
                            <Button
                                variant="success"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRequestToApprove(row);
                                }}
                                leftIcon={<Check size={14} />}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRequestToReject(row);
                                    setRejectionReason("");
                                    setRejectError("");
                                }}
                                leftIcon={<X size={14} />}
                            >
                                Reject
                            </Button>
                        </>
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
                        Team Leave Requests
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        Review, approve, or decline leave applications from your team members
                    </p>
                </div>

                <Button variant="outline" onClick={fetchTeamRequests} leftIcon={<RefreshCw size={16} />}>
                    Refresh
                </Button>
            </div>

            {/* Filter Bar */}
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
                    <div style={{ width: "280px" }}>
                        <Input
                            placeholder="Search by employee or leave type..."
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
                                <option value="PENDING">Pending Only</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="CANCELLED">Cancelled</option>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Requests Table */}
            <Card style={{ padding: "0" }}>
                <Table
                    columns={columns}
                    data={filteredRequests}
                    loading={loading}
                    emptyMessage="No leave requests found"
                    emptyDescription="There are no team leave requests matching your current filter."
                    onRowClick={(row) => setSelectedDetail(row)}
                />
            </Card>

            {/* Detail View Modal */}
            {selectedDetail && (
                <Modal
                    isOpen={!!selectedDetail}
                    onClose={() => setSelectedDetail(null)}
                    title="Leave Request Overview"
                    maxWidth="520px"
                    footer={
                        <>
                            {selectedDetail.status === "PENDING" && (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            setRequestToReject(selectedDetail);
                                            setSelectedDetail(null);
                                        }}
                                    >
                                        Reject Request
                                    </Button>
                                    <Button
                                        variant="success"
                                        onClick={() => {
                                            setRequestToApprove(selectedDetail);
                                            setSelectedDetail(null);
                                        }}
                                    >
                                        Approve Request
                                    </Button>
                                </>
                            )}
                            <Button variant="outline" onClick={() => setSelectedDetail(null)}>
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
                                padding: "0.875rem 1rem",
                                backgroundColor: "var(--gray-50)",
                                borderRadius: "var(--radius-md)"
                            }}
                        >
                            <div>
                                <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--gray-900)" }}>
                                    {selectedDetail.employee_name}
                                </h4>
                                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                                    {selectedDetail.employee_email}
                                </span>
                            </div>
                            <Badge status={selectedDetail.status}>{selectedDetail.status}</Badge>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                                    Leave Type:
                                </span>
                                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary-700)", marginTop: "0.125rem" }}>
                                    {selectedDetail.leave_type}
                                </p>
                            </div>
                            <div>
                                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                                    Duration:
                                </span>
                                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-900)", marginTop: "0.125rem" }}>
                                    {selectedDetail.duration_type === "HALF_DAY" ? "Half Day (0.5d)" : "Full Day"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                                Date Range:
                            </span>
                            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-900)", marginTop: "0.125rem" }}>
                                {formatDate(selectedDetail.start_date)} — {formatDate(selectedDetail.end_date)}
                            </p>
                        </div>

                        <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>
                                Employee Reason:
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
                                {selectedDetail.reason}
                            </p>
                        </div>

                        {selectedDetail.status === "REJECTED" && selectedDetail.rejection_reason && (
                            <div
                                style={{
                                    padding: "0.875rem",
                                    backgroundColor: "var(--danger-50)",
                                    border: "1px solid var(--danger-100)",
                                    borderRadius: "var(--radius-md)"
                                }}
                            >
                                <span style={{ fontSize: "0.75rem", color: "var(--danger-700)", fontWeight: 700 }}>
                                    Rejection Reason:
                                </span>
                                <p style={{ fontSize: "0.875rem", color: "var(--danger-800)", marginTop: "0.25rem" }}>
                                    {selectedDetail.rejection_reason}
                                </p>
                            </div>
                        )}

                        <div style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>
                            Submitted on {formatDateTime(selectedDetail.created_at)}
                        </div>
                    </div>
                </Modal>
            )}

            {/* Approve Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!requestToApprove}
                onClose={() => setRequestToApprove(null)}
                onConfirm={handleApprove}
                title="Approve Leave Request?"
                message={`Are you sure you want to approve ${requestToApprove?.employee_name}'s ${requestToApprove?.leave_type} request for ${formatDate(requestToApprove?.start_date)}? Leave balance will automatically be deducted.`}
                confirmText="Yes, Approve Leave"
                cancelText="Cancel"
                variant="success"
                loading={approving}
            />

            {/* Reject Modal with Required Reason */}
            {requestToReject && (
                <Modal
                    isOpen={!!requestToReject}
                    onClose={() => setRequestToReject(null)}
                    title="Reject Leave Request"
                    subtitle={`State the reason for rejecting ${requestToReject.employee_name}'s application`}
                    maxWidth="480px"
                    footer={
                        <>
                            <Button variant="outline" onClick={() => setRequestToReject(null)} disabled={rejecting}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleReject} loading={rejecting}>
                                Confirm Rejection
                            </Button>
                        </>
                    }
                >
                    {rejectError && (
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
                                gap: "0.5rem",
                                marginBottom: "1rem"
                            }}
                        >
                            <AlertCircle size={16} />
                            <span>{rejectError}</span>
                        </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-700)" }}>
                            Rejection Reason <span style={{ color: "var(--danger-600)" }}>*</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Please provide a clear reason for the rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "0.625rem 0.875rem",
                                fontSize: "0.875rem",
                                fontFamily: "var(--font-body)",
                                color: "var(--gray-900)",
                                border: "1px solid var(--gray-300)",
                                borderRadius: "var(--radius-md)",
                                outline: "none",
                                resize: "vertical"
                            }}
                        />
                        <span style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>
                            This explanation will be shared with the employee.
                        </span>
                    </div>
                </Modal>
            )}
        </div>
    );
};
