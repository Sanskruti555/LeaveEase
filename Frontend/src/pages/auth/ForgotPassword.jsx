import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your registered email address.");
            return;
        }

        try {
            setLoading(true);
            const res = await authApi.forgotPassword({ email: email.trim() });
            if (res.success) {
                addToast("Password reset OTP sent to your email!", "success");
                navigate("/reset-password", { state: { email: email.trim() } });
            }
        } catch (err) {
            console.error("Forgot Password Error:", err);
            setError(err.message || "Failed to process request. Please check your email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "var(--gray-900)",
                        marginBottom: "0.375rem"
                    }}
                >
                    Forgot Password
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                    Enter your registered email to receive a password reset OTP
                </p>
            </div>

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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <Input
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={18} />}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    style={{ width: "100%" }}
                >
                    Send Reset OTP
                </Button>
            </form>

            <div
                style={{
                    marginTop: "1.5rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--border-color)",
                    textAlign: "center"
                }}
            >
                <Link
                    to="/login"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        color: "var(--gray-600)",
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        fontWeight: 600
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back to Sign In</span>
                </Link>
            </div>
        </div>
    );
};
