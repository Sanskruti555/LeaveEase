import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { User, Phone, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Shield, Mail, Loader2 } from "lucide-react";
import { invitationApi } from "../../api/invitation.api";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { formatRole } from "../../utils/formatters";

export const AcceptInvitation = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [invitation, setInvitation] = useState(null);
    const [validating, setValidating] = useState(true);
    const [validationError, setValidationError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setValidationError("No invitation token provided.");
                setValidating(false);
                return;
            }

            try {
                setValidating(true);
                const res = await invitationApi.getInvitationByToken(token);
                if (res.success && res.data) {
                    setInvitation(res.data);
                } else {
                    setValidationError(res.message || "Invalid invitation token.");
                }
            } catch (err) {
                console.error("Token validation error:", err);
                setValidationError(err.message || "Invitation is invalid or has expired.");
            } finally {
                setValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formError) setFormError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.name.trim() || !formData.password) {
            setFormError("Please fill in all required fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setFormError("Password must be at least 8 characters long.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await invitationApi.acceptInvitation(token, {
                name: formData.name.trim(),
                phone: formData.phone.trim() || null,
                password: formData.password
            });

            if (res.success) {
                setSuccess(true);
                addToast("Account created successfully! You can now sign in.", "success");
            }
        } catch (err) {
            console.error("Accept Invitation Error:", err);
            setFormError(err.message || "Failed to accept invitation.");
        } finally {
            setSubmitting(false);
        }
    };

    if (validating) {
        return (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <Loader2 className="animate-spin" size={36} style={{ color: "var(--primary-600)", margin: "0 auto 1rem" }} />
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--gray-800)" }}>
                    Validating Invitation...
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.25rem" }}>
                    Please wait while we verify your invitation link.
                </p>
            </div>
        );
    }

    if (validationError) {
        return (
            <div style={{ textAlign: "center" }}>
                <div
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--danger-50)",
                        color: "var(--danger-600)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem"
                    }}
                >
                    <AlertCircle size={24} />
                </div>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
                    Invalid Invitation
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                    {validationError}
                </p>
                <Button variant="primary" onClick={() => navigate("/login")}>
                    Go to Sign In
                </Button>
            </div>
        );
    }

    if (success) {
        return (
            <div style={{ textAlign: "center" }} className="animate-fade-in">
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
                    <CheckCircle2 size={26} />
                </div>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
                    Welcome to LeaveEase!
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", lineHeight: 1.5, marginBottom: "1.75rem" }}>
                    Your account has been created successfully. You can now log in and manage your leaves.
                </p>
                <Button variant="primary" size="lg" onClick={() => navigate("/login")} style={{ width: "100%" }}>
                    Sign In to Account
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "var(--gray-900)",
                        marginBottom: "0.375rem"
                    }}
                >
                    Accept Invitation
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                    Complete your profile to join your company on LeaveEase
                </p>
            </div>

            {/* Invitation Info Box */}
            <div
                style={{
                    backgroundColor: "var(--gray-50)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem",
                    marginBottom: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>Invited Email:</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--gray-900)", fontWeight: 700 }}>
                        {invitation?.email}
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 600 }}>Assigned Role:</span>
                    <Badge status={invitation?.role}>{formatRole(invitation?.role)}</Badge>
                </div>
            </div>

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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Input
                    label="Full Name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    leftIcon={<User size={18} />}
                    required
                />

                <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+1 555 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    leftIcon={<Phone size={18} />}
                />

                <Input
                    label="Create Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    leftIcon={<Lock size={18} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--gray-400)",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                    helperText="Must be at least 8 characters"
                    required
                />

                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    leftIcon={<Lock size={18} />}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={submitting}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                >
                    Accept Invitation & Create Account
                </Button>
            </form>
        </div>
    );
};

export default AcceptInvitation;
