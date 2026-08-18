import React, { useState, useEffect } from "react";
import { Mail, UserPlus, Send, CheckCircle2, AlertCircle, Building2, Users } from "lucide-react";
import { invitationApi } from "../../api/invitation.api";
import { branchApi } from "../../api/branch.api";
import { userApi } from "../../api/user.api";
import { useToast } from "../../context/ToastContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Badge } from "../../components/common/Badge";

export const CompanyInvitations = () => {
    const { addToast } = useToast();

    const [branches, setBranches] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        role: "EMPLOYEE",
        branch_id: "",
        manager_id: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        const loadInitial = async () => {
            try {
                setLoadingData(true);
                const [branchesRes, managersRes] = await Promise.all([
                    branchApi.getBranches(),
                    userApi.getUsers({ role: "MANAGER", limit: 100 })
                ]);

                if (branchesRes.success && Array.isArray(branchesRes.data)) {
                    const activeBranches = branchesRes.data.filter((b) => b.status === "ACTIVE");
                    setBranches(activeBranches);
                    if (activeBranches.length > 0) {
                        setFormData((prev) => ({ ...prev, branch_id: String(activeBranches[0].branch_id) }));
                    }
                }

                if (managersRes.success && managersRes.data) {
                    const activeManagers = (managersRes.data.users || []).filter((u) => u.status === "ACTIVE");
                    setManagers(activeManagers);
                    if (activeManagers.length > 0) {
                        setFormData((prev) => ({ ...prev, manager_id: String(activeManagers[0].user_id) }));
                    }
                }
            } catch (err) {
                console.error("Load Invitation Requirements Error:", err);
            } finally {
                setLoadingData(false);
            }
        };

        loadInitial();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    // Filter managers who belong to the selected branch
    const branchManagers = managers.filter(
        (m) => String(m.branch_id) === String(formData.branch_id)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim()) {
            setError("Please enter an email address.");
            return;
        }

        if (!formData.branch_id) {
            setError("Please select a branch location.");
            return;
        }

        if (formData.role === "EMPLOYEE" && !formData.manager_id) {
            setError("A manager is required when inviting an employee.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                email: formData.email.trim(),
                role: formData.role,
                branch_id: Number(formData.branch_id),
                manager_id: formData.role === "EMPLOYEE" ? Number(formData.manager_id) : undefined
            };

            const res = await invitationApi.createInvitation(payload);

            if (res.success) {
                setSuccessData(res.data);
                addToast(`Invitation sent to ${formData.email.trim()}!`, "success");
            }
        } catch (err) {
            console.error("Invite Error:", err);
            setError(err.message || "Failed to create invitation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gray-900)" }}>
                    Enterprise Invitations
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                    Send onboarding invites to Branch Admins, Managers, and Employees
                </p>
            </div>

            <Card
                title="Send Team Invitation"
                subtitle="Create a secure onboarding link with pre-assigned role, branch, and management hierarchy"
            >
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
                            gap: "0.5rem",
                            marginBottom: "1.25rem"
                        }}
                    >
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {successData ? (
                    <div style={{ textAlign: "center", padding: "1.5rem 0" }} className="animate-fade-in">
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "var(--radius-full)",
                                backgroundColor: "var(--success-50)",
                                color: "var(--success-600)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1rem"
                            }}
                        >
                            <CheckCircle2 size={24} />
                        </div>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--gray-900)" }}>
                            Invitation Sent Successfully!
                        </h3>
                        <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                            An invitation token has been emailed to <strong>{formData.email}</strong>.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setSuccessData(null);
                                setFormData((prev) => ({ ...prev, email: "" }));
                            }}
                        >
                            Send Another Invitation
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <Input
                            label="Recipient Corporate Email"
                            name="email"
                            type="email"
                            placeholder="colleague@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={<Mail size={18} />}
                            required
                        />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <Select
                                label="Target Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="MANAGER">Manager</option>
                                <option value="BRANCH_ADMIN">Branch Admin</option>
                            </Select>

                            <Select
                                label="Assigned Branch"
                                name="branch_id"
                                value={formData.branch_id}
                                onChange={handleChange}
                                required
                            >
                                {branches.length === 0 ? (
                                    <option value="" disabled>
                                        No active branches found
                                    </option>
                                ) : (
                                    branches.map((b) => (
                                        <option key={b.branch_id} value={b.branch_id}>
                                            {b.name} ({b.city})
                                        </option>
                                    ))
                                )}
                            </Select>
                        </div>

                        {formData.role === "EMPLOYEE" && (
                            <Select
                                label="Assign to Manager"
                                name="manager_id"
                                value={formData.manager_id}
                                onChange={handleChange}
                                helperText="Select the reporting manager for leave approvals"
                                required
                            >
                                {branchManagers.length === 0 ? (
                                    <option value="" disabled>
                                        No active managers in the selected branch
                                    </option>
                                ) : (
                                    branchManagers.map((m) => (
                                        <option key={m.user_id} value={m.user_id}>
                                            {m.name} ({m.email})
                                        </option>
                                    ))
                                )}
                            </Select>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                leftIcon={<Send size={16} />}
                            >
                                Send Invitation
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};
