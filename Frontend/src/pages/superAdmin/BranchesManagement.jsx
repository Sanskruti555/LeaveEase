import React, { useState, useEffect } from "react";
import {
    Building2,
    Plus,
    Search,
    Edit2,
    CheckCircle2,
    XCircle,
    MapPin,
    Mail,
    Phone,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { branchApi } from "../../api/branch.api";
import { useToast } from "../../context/ToastContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Table } from "../../components/common/Table";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { formatDate } from "../../utils/formatters";

export const BranchesManagement = () => {
    const { addToast } = useToast();

    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal Form State (Create or Edit)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: ""
    });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    // Toggle Status State
    const [branchToToggle, setBranchToToggle] = useState(null);
    const [toggling, setToggling] = useState(false);

    const fetchBranches = async () => {
        try {
            setLoading(true);
            const res = await branchApi.getBranches();
            if (res.success && Array.isArray(res.data)) {
                setBranches(res.data);
            }
        } catch (err) {
            console.error("Fetch Branches Error:", err);
            setError(err.message || "Failed to load branches.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const openCreateModal = () => {
        setEditingBranch(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            country: ""
        });
        setFormError("");
        setIsFormModalOpen(true);
    };

    const openEditModal = (branch) => {
        setEditingBranch(branch);
        setFormData({
            name: branch.name || "",
            email: branch.email || "",
            phone: branch.phone || "",
            address: branch.address || "",
            city: branch.city || "",
            state: branch.state || "",
            country: branch.country || ""
        });
        setFormError("");
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.name.trim() || !formData.email.trim() || !formData.city.trim() || !formData.state.trim() || !formData.country.trim()) {
            setFormError("Name, Email, City, State, and Country are required.");
            return;
        }

        try {
            setSaving(true);
            if (editingBranch) {
                const res = await branchApi.updateBranch(editingBranch.branch_id, {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim() || null,
                    address: formData.address.trim() || null,
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    country: formData.country.trim()
                });
                if (res.success) {
                    addToast("Branch updated successfully!", "success");
                    setIsFormModalOpen(false);
                    fetchBranches();
                }
            } else {
                const res = await branchApi.createBranch({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim() || null,
                    address: formData.address.trim() || null,
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    country: formData.country.trim()
                });
                if (res.success) {
                    addToast("Branch created successfully!", "success");
                    setIsFormModalOpen(false);
                    fetchBranches();
                }
            }
        } catch (err) {
            console.error("Save Branch Error:", err);
            setFormError(err.message || "Failed to save branch.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!branchToToggle) return;

        const newStatus = branchToToggle.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        try {
            setToggling(true);
            const res = await branchApi.updateBranchStatus(branchToToggle.branch_id, newStatus);
            if (res.success) {
                addToast(`Branch ${newStatus.toLowerCase()} successfully!`, "success");
                setBranchToToggle(null);
                fetchBranches();
            }
        } catch (err) {
            console.error("Toggle Branch Status Error:", err);
            addToast(err.message || "Failed to update branch status.", "error");
        } finally {
            setToggling(false);
        }
    };

    const filteredBranches = branches.filter((b) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            b.name?.toLowerCase().includes(term) ||
            b.city?.toLowerCase().includes(term) ||
            b.email?.toLowerCase().includes(term)
        );
    });

    const columns = [
        {
            header: "Branch Name",
            accessor: "name",
            render: (val, row) => (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--primary-50)",
                            color: "var(--primary-700)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700
                        }}
                    >
                        <Building2 size={16} />
                    </div>
                    <div>
                        <strong style={{ color: "var(--gray-900)" }}>{val}</strong>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)" }}>
                            ID: #{row.branch_id}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Contact Info",
            accessor: "email",
            render: (val, row) => (
                <div>
                    <span style={{ display: "block", fontSize: "0.8125rem", color: "var(--gray-800)" }}>
                        {val}
                    </span>
                    {row.phone && (
                        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)" }}>
                            {row.phone}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: "Location",
            accessor: "city",
            render: (_, row) => (
                <span style={{ fontSize: "0.8125rem", color: "var(--gray-700)" }}>
                    {row.city}, {row.state}, {row.country}
                </span>
            )
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
                        onClick={() => setBranchToToggle(row)}
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
                        Branch Management
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        Configure enterprise office branches, contact details, and locations
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Button variant="outline" onClick={fetchBranches} leftIcon={<RefreshCw size={16} />}>
                        Refresh
                    </Button>
                    <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus size={18} />}>
                        Add New Branch
                    </Button>
                </div>
            </div>

            {/* Filter */}
            <Card style={{ padding: "1rem 1.25rem" }}>
                <div style={{ maxWidth: "320px" }}>
                    <Input
                        placeholder="Search by branch name, city, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search size={16} />}
                    />
                </div>
            </Card>

            {/* Table */}
            <Card style={{ padding: "0" }}>
                <Table
                    columns={columns}
                    data={filteredBranches}
                    loading={loading}
                    emptyMessage="No branches found"
                    emptyDescription="There are no company branches created yet. Click 'Add New Branch' to create one."
                />
            </Card>

            {/* Create / Edit Branch Modal */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title={editingBranch ? "Edit Branch" : "Add New Branch"}
                subtitle={editingBranch ? `Update details for ${editingBranch.name}` : "Create a new operational branch"}
                maxWidth="560px"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsFormModalOpen(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleFormSubmit} loading={saving}>
                            {editingBranch ? "Update Branch" : "Create Branch"}
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
                        label="Branch Name"
                        placeholder="e.g. Headquarters / Pune Branch"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <Input
                            label="Branch Email"
                            type="email"
                            placeholder="branch@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            required
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="+1 555 123 4567"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                    </div>

                    <Input
                        label="Street Address"
                        placeholder="123 Business Tower, Suite 400"
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                        <Input
                            label="City"
                            placeholder="Pune"
                            value={formData.city}
                            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                            required
                        />

                        <Input
                            label="State / Province"
                            placeholder="Maharashtra"
                            value={formData.state}
                            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                            required
                        />

                        <Input
                            label="Country"
                            placeholder="India"
                            value={formData.country}
                            onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                            required
                        />
                    </div>
                </form>
            </Modal>

            {/* Toggle Status Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!branchToToggle}
                onClose={() => setBranchToToggle(null)}
                onConfirm={handleToggleStatus}
                title={`${branchToToggle?.status === "ACTIVE" ? "Deactivate" : "Activate"} Branch?`}
                message={`Are you sure you want to ${branchToToggle?.status === "ACTIVE" ? "deactivate" : "activate"} ${branchToToggle?.name}? ${branchToToggle?.status === "ACTIVE" ? "Users cannot be assigned to inactive branches." : ""}`}
                confirmText={branchToToggle?.status === "ACTIVE" ? "Deactivate" : "Activate"}
                cancelText="Cancel"
                variant={branchToToggle?.status === "ACTIVE" ? "danger" : "primary"}
                loading={toggling}
            />
        </div>
    );
};
