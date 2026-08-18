import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { KeyRound, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        otp: "",
        new_password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim() || !formData.otp.trim() || !formData.new_password) {
            setError("All fields are required.");
            return;
        }

        if (formData.new_password !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (formData.new_password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        try {
            setLoading(true);
            const res = await authApi.resetPassword({
                email: formData.email.trim(),
                otp: formData.otp.trim(),
                new_password: formData.new_password
            });

            if (res.success) {
                addToast("Password reset successfully! Please sign in with your new password.", "success");
                navigate("/login", { replace: true });
            }
        } catch (err) {
            console.error("Reset Password Error:", err);
            setError(err.message || "Failed to reset password. Please verify the OTP.");
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
                    Reset Password
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                    Enter the reset OTP sent to your email and your new password
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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Input
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    leftIcon={<Mail size={18} />}
                    required
                />

                <Input
                    label="6-Digit Reset OTP"
                    name="otp"
                    placeholder="123456"
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, otp: e.target.value.replace(/\D/g, "") }))
                    }
                    leftIcon={<KeyRound size={18} />}
                    inputStyle={{
                        letterSpacing: "0.2em",
                        fontWeight: 700,
                        textAlign: "center"
                    }}
                    required
                />

                <Input
                    label="New Password"
                    name="new_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.new_password}
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
                    label="Confirm New Password"
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
                    loading={loading}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                >
                    Reset Password
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
                Remembered your password?{" "}
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
