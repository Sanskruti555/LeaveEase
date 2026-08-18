import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { invitationApi } from "../../api/invitation.api";
import { useToast } from "../../context/ToastContext";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export const InviteEmployee = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sentData, setSentData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter the employee's email address.");
            return;
        }

        try {
            setLoading(true);
            const res = await invitationApi.createInvitation({
                email: email.trim(),
                role: "EMPLOYEE"
            });

            if (res.success) {
                setSentData(res.data);
                addToast("Invitation sent to employee successfully!", "success");
            }
        } catch (err) {
            console.error("Invite Employee Error:", err);
            setError(err.message || "Failed to send invitation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                    to="/manager/team"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        color: "var(--gray-500)",
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        fontWeight: 600
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back to Team Members</span>
                </Link>
            </div>

            <Card
                title="Invite New Employee"
                subtitle="Send an official email invitation to onboard a new employee to your direct team"
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

                {sentData ? (
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
                            Invitation Dispatched!
                        </h3>
                        <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                            An invitation link has been emailed to <strong>{email}</strong>. Once accepted, they will be assigned directly under your management.
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSentData(null);
                                    setEmail("");
                                }}
                            >
                                Invite Another Employee
                            </Button>
                            <Button variant="primary" onClick={() => navigate("/manager/team")}>
                                View Team
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <Input
                            label="Employee Corporate Email"
                            name="email"
                            type="email"
                            placeholder="employee@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail size={18} />}
                            helperText="An email invitation with a secure acceptance token will be sent."
                            required
                        />

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/manager/team")}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                leftIcon={<UserPlus size={16} />}
                            >
                                Send Invitation Email
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};
