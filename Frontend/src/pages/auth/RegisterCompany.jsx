import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export const RegisterCompany = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        company_name: "",
        admin_name: "",
        email: "",
        phone: "",
        password: "",
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

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        try {
            setLoading(true);
            const res = await authApi.registerCompany({
                company_name: formData.company_name.trim(),
                admin_name: formData.admin_name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password
            });

            if (res.success) {
                addToast("Verification OTP sent to your email!", "success");
                navigate("/verify-otp", { state: { email: formData.email.trim() } });
            }
        } catch (err) {
            console.error("Register Error:", err);
            setError(err.message || "Failed to register company.");
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
                    Register Organization
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                    Set up your enterprise leave management workspace
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
                    label="Company Name"
                    name="company_name"
                    placeholder="Acme Corporation"
                    value={formData.company_name}
                    onChange={handleChange}
                    leftIcon={<Building2 size={18} />}
                    required
                />

                <Input
                    label="Super Admin Name"
                    name="admin_name"
                    placeholder="Jane Doe"
                    value={formData.admin_name}
                    onChange={handleChange}
                    leftIcon={<User size={18} />}
                    required
                />

                <Input
                    label="Corporate Email"
                    name="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    leftIcon={<Mail size={18} />}
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
                    required
                />

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
                    loading={loading}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                >
                    Create Company Account
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
                Already have an organization?{" "}
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
