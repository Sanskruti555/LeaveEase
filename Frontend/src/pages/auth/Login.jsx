import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export const Login = () => {
    const { login } = useAuth();
    const { addToast } = useToast();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isSessionExpired = new URLSearchParams(location.search).get("sessionExpired");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim() || !formData.password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            setLoading(true);
            const res = await login({
                email: formData.email.trim(),
                password: formData.password
            });

            if (res.success) {
                addToast("Welcome back! Login successful.", "success");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.message || "Invalid credentials. Please check your email and password.");
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
                    Sign in to your account
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                    Enter your credentials to access LeaveEase
                </p>
            </div>

            {isSessionExpired && (
                <div
                    style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "var(--warning-50)",
                        border: "1px solid var(--warning-100)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--warning-700)",
                        fontSize: "0.8125rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "1.25rem"
                    }}
                >
                    <AlertCircle size={16} />
                    <span>Your session has expired. Please log in again.</span>
                </div>
            )}

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
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    leftIcon={<Mail size={18} />}
                    required
                />

                <div>
                    <Input
                        label="Password"
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
                        required
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.375rem" }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                fontSize: "0.8125rem",
                                color: "var(--primary-600)",
                                textDecoration: "none",
                                fontWeight: 600
                            }}
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                >
                    Sign In
                </Button>
            </form>

            <div
                style={{
                    marginTop: "1.75rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--border-color)",
                    textAlign: "center",
                    fontSize: "0.875rem",
                    color: "var(--gray-500)"
                }}
            >
                Registering a new company?{" "}
                <Link
                    to="/register"
                    style={{
                        color: "var(--primary-600)",
                        textDecoration: "none",
                        fontWeight: 700
                    }}
                >
                    Create Organization
                </Link>
            </div>
        </div>
    );
};
