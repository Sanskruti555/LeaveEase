import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Scale } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

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
            else {
                // Trigger the red alert box with the backend's exact message!
                setError(res.message || "Invalid credentials. Please check your email and password.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container" style={{ backgroundImage: "url('/download.jpg')" }}>
            
            <div className="glass-card">
                
                {/* Header Section */}
                <div className="glass-header">
                    <Scale size={48} strokeWidth={1.5} color="#1f4a42" />
                    <h1>Leave Ease</h1>
                    <p>LOGIN PORTAL</p>
                </div>

                {/* Alerts */}
                {isSessionExpired && (
                    <div className="alert-box warning-alert">
                        <AlertCircle size={16} />
                        <span>Your session has expired. Please log in again.</span>
                    </div>
                )}

                {error && (
                    <div className="alert-box error-alert">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="glass-form">
                    
                    <div className="input-group">
                        <label htmlFor="email">Email Address or Username</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="e.g., employee@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="glass-input"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="glass-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Options Row */}
                    <div className="options-row">
                        <label className="checkbox-label">
                            <input type="checkbox" className="glass-checkbox" />
                            <span>Remember Me</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="glass-submit-btn"
                    >
                        {loading ? "LOGGING IN..." : "LOGIN"}
                    </button>
                </form>

                <div className="glass-footer">
                    Registering a new company? <Link to="/register">Create Organization</Link>
                </div>
            </div>
        </div>
    );
};