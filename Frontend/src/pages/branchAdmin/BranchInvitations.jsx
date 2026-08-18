import React, { useState, useEffect } from "react";
import { Mail, UserPlus, Send, RefreshCw, X, CheckCircle2, AlertCircle, Users } from "lucide-react";
import { invitationApi } from "../../api/invitation.api";
import { userApi } from "../../api/user.api";
import { useToast } from "../../context/ToastContext";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Badge } from "../../components/common/Badge";
import { formatRole } from "../../utils/formatters";

export const BranchInvitations = () => {
    const { addToast } = useToast();

    const [managers, setManagers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        role: "EMPLOYEE",
        manager_id: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                setLoadingManagers(true);
                const res = await userApi.getUsers({ role: "MANAGER", limit: 100 });
                if (res.success && res.data) {
                    const activeManagers = (res.data.users || []).filter((u) => u.status === "ACTIVE");
                    setManagers(activeManagers);
                    if (activeManagers.length > 0) {
                        setFormData((prev) => ({ ...prev, manager_id: String(activeManagers[0].user_id) }));
                    }
                }
            } catch (err) {
                console.error("Fetch Managers Error:", err);
            } finally {
                setLoadingManagers(false);
            }
        };

        fetchManagers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim()) {
            setError("Please enter a valid email address.");
            return;
        }

        if (formData.role === "EMPLOYEE" && !formData.manager_id) {
            setError("A manager must be selected for employee invitations.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                email: formData.email.trim(),
                role: formData.role,
                manager_id: formData.role === "EMPLOYEE" ? Number(formData.manager_id) : undefined
            };

            const res = await invitationApi.createInvitation(payload);

            if (res.success) {
                setSuccessData(res.data);
                addToast(`Invitation sent to ${formData.email.trim()}!`, "success");
            }
        } catch (err) {
            console.error("Branch Invite Error:", err);
            setError(err.message || "Failed to create invitation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gray-900)" }}>
                    Send Branch Invitation
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                    Invite new managers or employees to join your branch
                </p>
            </div>

            <Card
                title="New Staff Invitation"
                subtitle="The invited user will receive an email with an onboarding token to set their password"
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
                            An invitation link has been emailed to <strong>{formData.email}</strong>.
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
                            placeholder="staff@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={<Mail size={18} />}
                            required
                        />

                        <Select
                            label="Target Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="MANAGER">Manager</option>
                        </Select>

                        {formData.role === "EMPLOYEE" && (
                            <Select
                                label="Assign to Manager"
                                name="manager_id"
                                value={formData.manager_id}
                                onChange={handleChange}
                                helperText="Select which manager will review this employee's leave requests"
                                required
                            >
                                {managers.length === 0 ? (
                                    <option value="" disabled>
                                        No active managers found in this branch
                                    </option>
                                ) : (
                                    managers.map((mgr) => (
                                        <option key={mgr.user_id} value={mgr.user_id}>
                                            {mgr.name} ({mgr.email})
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
