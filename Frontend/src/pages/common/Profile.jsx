import React, { useState, useEffect } from "react";
import { User, Phone, Mail, Lock, Shield, Calendar, Building2, Eye, EyeOff, Save, CheckCircle2, AlertCircle, ShieldCheck, Key } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { authApi } from "../../api/auth.api";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { formatRole, formatDateTime } from "../../utils/formatters";

export const Profile = () => {
    const { user, updateUserData, refreshProfile } = useAuth();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'password'

    // Profile Form State
    const [profileData, setFormData] = useState({
        name: user?.name || "",
        phone: user?.phone || ""
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState("");

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || ""
            });
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileError("");

        if (!profileData.name.trim()) {
            setProfileError("Full Name is required.");
            return;
        }

        try {
            setProfileLoading(true);
            const res = await authApi.updateProfile({
                name: profileData.name.trim(),
                phone: profileData.phone.trim() || null
            });

            if (res.success) {
                updateUserData({ name: profileData.name.trim(), phone: profileData.phone.trim() });
                addToast("Profile updated successfully!", "success");
            }
        } catch (err) {
            console.error("Profile update error:", err);
            setProfileError(err.message || "Failed to update profile.");
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");

        if (!passwordData.current_password || !passwordData.new_password) {
            setPasswordError("Please provide current and new passwords.");
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError("New passwords do not match.");
            return;
        }

        if (passwordData.new_password.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            return;
        }

        try {
            setPasswordLoading(true);
            const res = await authApi.changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            });

            if (res.success) {
                addToast("Password changed successfully!", "success");
                setPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_password: ""
                });
            }
        } catch (err) {
            console.error("Change password error:", err);
            setPasswordError(err.message || "Failed to change password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* User Hero Card */}
            <Card style={{ padding: "0" }}>
                <div
                    style={{
                        padding: "1.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1.25rem",
                        flexWrap: "wrap"
                    }}
                >
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "var(--radius-full)",
                            backgroundColor: "var(--primary-600)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.75rem",
                            fontWeight: 800
                        }}
                    >
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>

                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                            <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--gray-900)" }}>
                                {user?.name || "User"}
                            </h2>
                            <Badge status={user?.role}>{formatRole(user?.role)}</Badge>
                        </div>
                        <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>
                            {user?.email}
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.75rem",
                            color: "var(--gray-500)",
                            backgroundColor: "var(--gray-50)",
                            padding: "0.5rem 0.875rem",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-color)"
                        }}
                    >
                        <Calendar size={14} />
                        <span>Member since {formatDateTime(user?.created_at)}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div
                    style={{
                        display: "flex",
                        borderTop: "1px solid var(--border-color)",
                        backgroundColor: "var(--gray-50)",
                        padding: "0 1rem"
                    }}
                >
                    <button
                        onClick={() => setActiveTab("profile")}
                        style={{
                            padding: "0.875rem 1.25rem",
                            background: "none",
                            border: "none",
                            borderBottom: activeTab === "profile" ? "2px solid var(--primary-600)" : "2px solid transparent",
                            color: activeTab === "profile" ? "var(--primary-700)" : "var(--gray-600)",
                            fontWeight: activeTab === "profile" ? 700 : 500,
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            transition: "all 0.12s ease"
                        }}
                    >
                        Personal Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        style={{
                            padding: "0.875rem 1.25rem",
                            background: "none",
                            border: "none",
                            borderBottom: activeTab === "password" ? "2px solid var(--primary-600)" : "2px solid transparent",
                            color: activeTab === "password" ? "var(--primary-700)" : "var(--gray-600)",
                            fontWeight: activeTab === "password" ? 700 : 500,
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            transition: "all 0.12s ease"
                        }}
                    >
                        Security & Password
                    </button>
                </div>
            </Card>

            {/* Tab 1: Profile Details */}
            {activeTab === "profile" && (
                <Card
                    title="Profile Details"
                    subtitle="Update your personal identification and contact information"
                    className="animate-fade-in"
                >
                    {profileError && (
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
                            <span>{profileError}</span>
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                            <Input
                                label="Full Name"
                                name="name"
                                value={profileData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                leftIcon={<User size={18} />}
                                required
                            />

                           <Input
                               label="Phone Number"
                               name="phone"
                               type="tel"
                               placeholder="e.g. 9876543210"
                               value={profileData.phone}
                               onChange={(e) => {
                               // 1. Strip out any character that is NOT a number
                               const numericValue = e.target.value.replace(/\D/g, "");
        
                               // 2. Only update the state if the length is 10 or less
                               if (numericValue.length <= 10) {
                               setFormData((prev) => ({ ...prev, phone: numericValue }));
                               }
                              }}
                               leftIcon={<Phone size={18} />}
                               maxLength={10} 
                               helperText="Must be exactly 10 digits"
                              />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                            <Input
                                label="Corporate Email"
                                value={user?.email || ""}
                                leftIcon={<Mail size={18} />}
                                disabled
                                helperText="Email address is tied to your organization account"
                            />

                            <Input
                                label="System Role"
                                value={formatRole(user?.role)}
                                leftIcon={<Shield size={18} />}
                                disabled
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={profileLoading}
                                leftIcon={<Save size={16} />}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Tab 2: Change Password */}
            {activeTab === "password" && (
                <Card
                    title="Change Password"
                    subtitle="Ensure your account is using a long, random password to stay secure"
                    className="animate-fade-in"
                >
                    {/* NEW: Last Changed Status Banner */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "1rem",
                            backgroundColor: "var(--success-50, #ecfdf5)",
                            border: "1px solid var(--success-100, #d1fae5)",
                            borderRadius: "var(--radius-md, 8px)",
                            color: "var(--success-700, #047857)",
                            marginBottom: "1.5rem"
                        }}
                    >
                        <ShieldCheck size={20} />
                        <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                            Your password is secure. Last changed on <strong>{user?.password_updated_at ? formatDateTime(user.password_updated_at) : 'recently'}</strong>.
                        </span>
                    </div>

                    {passwordError && (
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
                            <span>{passwordError}</span>
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div style={{ maxWidth: "400px" }}>
                            <Input
                                label="Current Password"
                                type={showCurrentPass ? "text" : "password"}
                                placeholder="••••••••"
                                value={passwordData.current_password}
                                onChange={(e) =>
                                    setPasswordData((prev) => ({ ...prev, current_password: e.target.value }))
                                }
                                leftIcon={<Lock size={18} />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "var(--gray-400)",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                                required
                            />
                        </div>

                        <div style={{ height: "1px", backgroundColor: "var(--border-color)", margin: "0.5rem 0", maxWidth: "600px" }} />

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", maxWidth: "600px" }}>
                            <Input
                                label="New Password"
                                type={showNewPass ? "text" : "password"}
                                placeholder="••••••••"
                                value={passwordData.new_password}
                                onChange={(e) =>
                                    setPasswordData((prev) => ({ ...prev, new_password: e.target.value }))
                                }
                                leftIcon={<Lock size={18} />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "var(--gray-400)",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                                helperText="Must be at least 8 characters"
                                required
                            />

                            <Input
                                label="Confirm New Password"
                                type={showNewPass ? "text" : "password"}
                                placeholder="••••••••"
                                value={passwordData.confirm_password}
                                onChange={(e) =>
                                    setPasswordData((prev) => ({ ...prev, confirm_password: e.target.value }))
                                }
                                leftIcon={<Lock size={18} />}
                                required
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "0.5rem" }}>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={passwordLoading}
                                leftIcon={<Key size={16} />} 
                            >
                                Update Password
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};