import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Search, Mail, Phone, Calendar, Shield, AlertCircle, RefreshCw } from "lucide-react";
import { userApi } from "../../api/user.api";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Table } from "../../components/common/Table";
import { Input } from "../../components/common/Input";
import { Pagination } from "../../components/common/Pagination";
import { formatDate } from "../../utils/formatters";

export const TeamMembers = () => {
    const [members, setMembers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMembers = async (page = 1) => {
        try {
            setLoading(true);
            const res = await userApi.getUsers({
                page,
                limit: 10,
                search: searchTerm || undefined
            });

            if (res.success && res.data) {
                setMembers(res.data.users || []);
                setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, total_pages: 1 });
            }
        } catch (err) {
            console.error("Fetch Team Members Error:", err);
            setError(err.message || "Failed to load team members.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers(1);
    }, [searchTerm]);

    const columns = [
        {
            header: "Employee Name",
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
                        {val ? val.charAt(0).toUpperCase() : "E"}
                    </div>
                    <div>
                        <strong style={{ color: "var(--gray-900)" }}>{val}</strong>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--gray-500)" }}>
                            ID: #{row.user_id}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Email",
            accessor: "email",
            render: (val) => (
                <span style={{ fontSize: "0.8125rem", color: "var(--gray-700)" }}>
                    {val}
                </span>
            )
        },
        {
            header: "Phone",
            accessor: "phone",
            render: (val) => (
                <span style={{ fontSize: "0.8125rem", color: "var(--gray-600)" }}>
                    {val || "-"}
                </span>
            )
        },
        {
            header: "Status",
            accessor: "status",
            render: (val) => <Badge status={val}>{val}</Badge>
        },
        {
            header: "Joined Date",
            accessor: "created_at",
            render: (val) => (
                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                    {formatDate(val)}
                </span>
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
                        Direct Team Members
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                        Employees assigned to your management group
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Button variant="outline" onClick={() => fetchMembers(pagination.page)} leftIcon={<RefreshCw size={16} />}>
                        Refresh
                    </Button>
                    <Link to="/manager/invite">
                        <Button variant="primary" leftIcon={<UserPlus size={16} />}>
                            Invite Employee
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filter */}
            <Card style={{ padding: "1rem 1.25rem" }}>
                <div style={{ maxWidth: "320px" }}>
                    <Input
                        placeholder="Search team member by name..."
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
                    data={members}
                    loading={loading}
                    emptyMessage="No employees found"
                    emptyDescription="You don't currently have any employees assigned to your team."
                />
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.total_pages}
                    totalItems={pagination.total}
                    pageSize={pagination.limit}
                    onPageChange={(p) => fetchMembers(p)}
                />
            </Card>
        </div>
    );
};
