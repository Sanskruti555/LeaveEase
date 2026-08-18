import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { KeyRound, Mail, AlertCircle, CheckCircle2, RotateCw } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [resendCooldown, setResendCooldown] = useState(60);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !otp.trim()) {
            setError("Please enter your email and the 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            const res = await authApi.verifyOTP({
                email: email.trim(),
                otp: otp.trim()
            });

            if (res.success) {
                addToast("Email verified successfully! You can now log in.", "success");
                navigate("/login", { replace: true });
            }
        } catch (err) {
            console.error("Verify OTP Error:", err);
            setError(err.message || "Failed to verify OTP. Please ensure the code is correct.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email.trim() || resendCooldown > 0) return;
        setError("");

        try {
            setResending(true);
            const res = await authApi.resendOTP({ email: email.trim() });
            if (res.success) {
                addToast("A new OTP code has been sent to your email.", "info");
                setResendCooldown(60);
            }
        } catch (err) {
            console.error("Resend OTP Error:", err);
            setError(err.message || "Failed to resend OTP.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                <div
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--primary-50)",
                        color: "var(--primary-600)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem"
                    }}
                >
                    <KeyRound size={24} />
                </div>
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "var(--gray-900)",
                        marginBottom: "0.375rem"
                    }}
                >
                    Verify Your Email
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                    We sent a 6-digit verification code to your email
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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
                <Input
                    label="Corporate Email"
                    name="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={18} />}
                    required
                />

                <Input
                    label="6-Digit OTP Code"
                    name="otp"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    leftIcon={<KeyRound size={18} />}
                    inputStyle={{
                        letterSpacing: "0.3em",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        textAlign: "center"
                    }}
                    required
                />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8125rem", color: "var(--gray-500)" }}>
                        Didn't receive the code?
                    </span>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending || resendCooldown > 0 || !email.trim()}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                            color: resendCooldown > 0 ? "var(--gray-400)" : "var(--primary-600)",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem"
                        }}
                    >
                        <RotateCw size={14} className={resending ? "animate-spin" : ""} />
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                    </button>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                >
                    Verify & Activate Account
                </Button>
            </form>

            <div
                style={{
                    marginTop: "1.5rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--border-color)",
                    textAlign: "center",
                    fontSize: "0.875rem",
                    color: "var(--gray-500)"
                }}
            >
                Back to{" "}
                <Link
                    to="/login"
                    style={{
                        color: "var(--primary-600)",
                        textDecoration: "none",
                        fontWeight: 700
                    }}
                >
                    Sign In
                </Link>
            </div>
        </div>
    );
};
