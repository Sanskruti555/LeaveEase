import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Search, Filter, RefreshCw, AlertCircle, Building2 } from "lucide-react";
import { userApi } from "../../api/user.api";
import { branchApi } from "../../api/branch.api";
import { useToast } from "../../context/ToastContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Table } from "../../components/common/Table";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Pagination } from "../../components/common/Pagination";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { formatDate, formatRole } from "../../utils/formatters";

export const CompanyUsers = () => {
    const { addToast } = useToast();

    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [roleFilter, setRoleFilter] = useState("");
    const [branchFilter, setBranchFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Toggle Status
    const [userToToggle, setUserToToggle] = useState(null);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await branchApi.getBranches();
                if (res.success && Array.isArray(res.data)) {
                    setBranches(res.data);
                }
            } catch (err) {
                console.error("Fetch branches error:", err);
            }
        };
        fetchBranches();
    }, []);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const res = await userApi.getUsers({
                page,
                limit: 10,
                role: roleFilter || undefined,
                branch_id: branchFilter || undefined,
                status: statusFilter || undefined,
                search: searchTerm || undefined
            });

            if (res.success && res.data) {
                setUsers(res.data.users || []);
                setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, total_pages: 1 });
            }
        } catch (err) {
            console.error("Fetch Users Error:", err);
            setError(err.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, [roleFilter, branchFilter, statusFilter, searchTerm]);

    const handleToggleStatus = async () => {
        if (!userToToggle) return;

        const newStatus = userToToggle.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        try {
            setToggling(true);
            const res = await userApi.updateUserStatus(userToToggle.user_id, newStatus);
            if (res.success) {
                addToast(`User ${newStatus.toLowerCase()} successfully!`, "success");
                setUserToToggle(null);
                fetchUsers(pagination.page);
            }
        } catch (err) {
            console.error("Toggle User Status Error:", err);
            addToast(err.message || "Failed to update user status.", "error");
        } finally {
            setToggling(false);
        }
    };

    const columns = [
        {
            header: "User",
            accessor: "name",
            render: (val, row) => (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "var(--radius-full)",
                            backgroundColor: "var(--primary-100)",
                            color: "var(--primary-700)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.8125rem"
                        }}
                    >
                        {val ? val.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                        <strong style={{ color: "var(--gray-900)" }}>{val}</strong>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)" }}>
                            {row.email}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Role",
            accessor: "role",
            render: (val) => <Badge status={val}>{formatRole(val)}</Badge>
        },
        {
            header: "Branch",
            accessor: "branch_name",
            render: (val, row) => (
                <span style={{ fontSize: "0.8125rem", color: "var(--gray-700)" }}>
                    {val || (row.role === "SUPER_ADMIN" ? "Corporate HQ" : "Unassigned")}
                </span>
            )
        },
        {
            header: "Status",
            accessor: "status",
            render: (val) => <Badge status={val}>{val}</Badge>
        },
        {
            header: "Member Since",
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
            render: (_, row) => {
                if (row.role === "SUPER_ADMIN") return null;
                return (
                    <Button
                        variant={row.status === "ACTIVE" ? "outline" : "primary"}
                        size="sm"
                        onClick={() => setUserToToggle(row)}
                    >
                        {row.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                );
            }
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
                        Enterprise Personnel & Users
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        View, search, and manage user accounts across all organization branches
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Button variant="outline" onClick={() => fetchUsers(pagination.page)} leftIcon={<RefreshCw size={16} />}>
                        Refresh
                    </Button>
                    <Link to="/admin/invitations">
                        <Button variant="primary" leftIcon={<UserPlus size={16} />}>
                            Invite Staff Member
                        </Button>
                    </Link>
                </div>
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
                    <div style={{ width: "240px" }}>
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<Search size={16} />}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <div style={{ width: "160px" }}>
                            <Select
                                value={branchFilter}
                                onChange={(e) => setBranchFilter(e.target.value)}
                            >
                                <option value="">All Branches</option>
                                {branches.map((b) => (
                                    <option key={b.branch_id} value={b.branch_id}>
                                        {b.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div style={{ width: "150px" }}>
                            <Select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="SUPER_ADMIN">Super Admins</option>
                                <option value="BRANCH_ADMIN">Branch Admins</option>
                                <option value="MANAGER">Managers</option>
                                <option value="EMPLOYEE">Employees</option>
                            </Select>
                        </div>

                        <div style={{ width: "130px" }}>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card style={{ padding: "0" }}>
                <Table
                    columns={columns}
                    data={users}
                    loading={loading}
                    emptyMessage="No users found"
                    emptyDescription="No organization staff found matching the selected criteria."
                />
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.total_pages}
                    totalItems={pagination.total}
                    pageSize={pagination.limit}
                    onPageChange={(p) => fetchUsers(p)}
                />
            </Card>

            {/* Toggle Status Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!userToToggle}
                onClose={() => setUserToToggle(null)}
                onConfirm={handleToggleStatus}
                title={`${userToToggle?.status === "ACTIVE" ? "Deactivate" : "Activate"} User Account?`}
                message={`Are you sure you want to ${userToToggle?.status === "ACTIVE" ? "deactivate" : "activate"} ${userToToggle?.name}? ${userToToggle?.status === "ACTIVE" ? "They will be unable to log in until reactivated." : "They will regain access to the platform."}`}
                confirmText={userToToggle?.status === "ACTIVE" ? "Deactivate" : "Activate"}
                cancelText="Cancel"
                variant={userToToggle?.status === "ACTIVE" ? "danger" : "primary"}
                loading={toggling}
            />
        </div>
    );
};
