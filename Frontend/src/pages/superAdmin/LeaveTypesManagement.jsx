import React, { useState, useEffect } from "react";
import {
    Layers,
    Plus,
    Edit2,
    CheckCircle2,
    XCircle,
    Calendar,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { leaveTypeApi } from "../../api/leaveType.api";
import { useToast } from "../../context/ToastContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Table } from "../../components/common/Table";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { formatDate, formatFrequency } from "../../utils/formatters";

export const LeaveTypesManagement = () => {
    const { addToast } = useToast();

    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal Form State (Create / Edit)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        leave_allocation: "",
        allocation_frequency: "YEARLY"
    });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    // Toggle Status State
    const [typeToToggle, setTypeToToggle] = useState(null);
    const [toggling, setToggling] = useState(false);

    const fetchLeaveTypes = async () => {
        try {
            setLoading(true);
            const res = await leaveTypeApi.getLeaveTypes();
            if (res.success && Array.isArray(res.data)) {
                setLeaveTypes(res.data);
            }
        } catch (err) {
            console.error("Fetch Leave Types Error:", err);
            setError(err.message || "Failed to load leave types.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const openCreateModal = () => {
        setEditingType(null);
        setFormData({
            name: "",
            description: "",
            leave_allocation: "12",
            allocation_frequency: "YEARLY"
        });
        setFormError("");
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingType(item);
        setFormData({
            name: item.name || "",
            description: item.description || "",
            leave_allocation: String(item.leave_allocation || ""),
            allocation_frequency: item.allocation_frequency || "YEARLY"
        });
        setFormError("");
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.name.trim()) {
            setFormError("Leave type name is required.");
            return;
        }

        const allocation = Number(formData.leave_allocation);
        if (isNaN(allocation) || allocation <= 0) {
            setFormError("Leave allocation must be a positive number.");
            return;
        }

        try {
            setSaving(true);
            if (editingType) {
                const res = await leaveTypeApi.updateLeaveType(editingType.leave_type_id, {
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    leave_allocation: allocation,
                    allocation_frequency: formData.allocation_frequency
                });

                if (res.success) {
                    addToast("Leave type updated successfully!", "success");
                    setIsModalOpen(false);
                    fetchLeaveTypes();
                }
            } else {
                const res = await leaveTypeApi.createLeaveType({
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    leave_allocation: allocation,
                    allocation_frequency: formData.allocation_frequency
                });

                if (res.success) {
                    addToast("Leave type created successfully!", "success");
                    setIsModalOpen(false);
                    fetchLeaveTypes();
                }
            }
        } catch (err) {
            console.error("Save Leave Type Error:", err);
            setFormError(err.message || "Failed to save leave type.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!typeToToggle) return;

        const newStatus = typeToToggle.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        try {
            setToggling(true);
            const res = await leaveTypeApi.updateLeaveTypeStatus(typeToToggle.leave_type_id, newStatus);
            if (res.success) {
                addToast(`Leave type ${newStatus.toLowerCase()} successfully!`, "success");
                setTypeToToggle(null);
                fetchLeaveTypes();
            }
        } catch (err) {
            console.error("Toggle Status Error:", err);
            addToast(err.message || "Failed to update status.", "error");
        } finally {
            setToggling(false);
        }
    };

    const columns = [
        {
            header: "Leave Category",
            accessor: "name",
            render: (val, row) => (
                <div>
                    <strong style={{ color: "var(--gray-900)" }}>{val}</strong>
                    {row.description && (
                        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                            {row.description}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: "Allocation",
            accessor: "leave_allocation",
            render: (val, row) => (
                <span style={{ fontWeight: 700, color: "var(--primary-700)" }}>
                    {val} days / {formatFrequency(row.allocation_frequency).toLowerCase()}
                </span>
            )
        },
        {
            header: "Frequency",
            accessor: "allocation_frequency",
            render: (val) => formatFrequency(val)
        },
        {
            header: "Status",
            accessor: "status",
            render: (val) => <Badge status={val}>{val}</Badge>
        },
        {
            header: "Created",
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
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(row)}
                        leftIcon={<Edit2 size={13} />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant={row.status === "ACTIVE" ? "ghost" : "primary"}
                        size="sm"
                        style={{ color: row.status === "ACTIVE" ? "var(--danger-600)" : "" }}
                        onClick={() => setTypeToToggle(row)}
                    >
                        {row.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
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
                        Leave Types & Allocations
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        Configure enterprise leave policies, recurring allocations, and frequencies
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Button variant="outline" onClick={fetchLeaveTypes} leftIcon={<RefreshCw size={16} />}>
                        Refresh
                    </Button>
                    <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus size={18} />}>
                        Add Leave Type
                    </Button>
                </div>
            </div>

            {/* Table */}
            <Card style={{ padding: "0" }}>
                <Table
                    columns={columns}
                    data={leaveTypes}
                    loading={loading}
                    emptyMessage="No leave types configured"
                    emptyDescription="Click 'Add Leave Type' to establish your organization's first leave policy."
                />
            </Card>

            {/* Create / Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingType ? "Edit Leave Type" : "Create Leave Type"}
                subtitle={editingType ? `Update policy for ${editingType.name}` : "Set up a new category of employee leave"}
                maxWidth="520px"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleFormSubmit} loading={saving}>
                            {editingType ? "Update Policy" : "Create Policy"}
                        </Button>
                    </>
                }
            >
                {formError && (
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
                            marginBottom: "1.25rem"
                        }}
                    >
                        <AlertCircle size={16} />
                        <span>{formError}</span>
                    </div>
                )}

                <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Input
                        label="Leave Type Name"
                        placeholder="e.g. Paid Casual Leave / Sick Leave"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <Input
                            label="Days Allocation"
                            type="number"
                            step="0.5"
                            min="0.5"
                            placeholder="12"
                            value={formData.leave_allocation}
                            onChange={(e) => setFormData((prev) => ({ ...prev, leave_allocation: e.target.value }))}
                            helperText="Number of allowed days"
                            required
                        />

                        <Select
                            label="Accrual Frequency"
                            name="allocation_frequency"
                            value={formData.allocation_frequency}
                            onChange={(e) => setFormData((prev) => ({ ...prev, allocation_frequency: e.target.value }))}
                            required
                        >
                            <option value="YEARLY">Yearly</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="QUARTERLY">Quarterly</option>
                            <option value="HALF_YEARLY">Half-Yearly</option>
                            <option value="ONE_TIME">Once (One-time)</option>
                        </Select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-700)" }}>
                            Description & Policy Note
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Explain the eligibility and guidelines for this leave category..."
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
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
                    </div>
                </form>
            </Modal>

            {/* Toggle Status Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!typeToToggle}
                onClose={() => setTypeToToggle(null)}
                onConfirm={handleToggleStatus}
                title={`${typeToToggle?.status === "ACTIVE" ? "Deactivate" : "Activate"} Leave Type?`}
                message={`Are you sure you want to ${typeToToggle?.status === "ACTIVE" ? "deactivate" : "activate"} ${typeToToggle?.name}? ${typeToToggle?.status === "ACTIVE" ? "Employees will no longer be able to apply for this leave type." : "Employees will be able to apply for this leave type."}`}
                confirmText={typeToToggle?.status === "ACTIVE" ? "Deactivate" : "Activate"}
                cancelText="Cancel"
                variant={typeToToggle?.status === "ACTIVE" ? "danger" : "primary"}
                loading={toggling}
            />
        </div>
    );
};
