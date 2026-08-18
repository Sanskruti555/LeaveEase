import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Menu,
    User,
    LogOut,
    ChevronDown
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { formatRole } from "../../utils/formatters";

export const Header = ({
    onMobileMenuToggle,
    title,
    onLogoutRequest
}) => {
    const { user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const userInitial = user?.name
        ? user.name.charAt(0).toUpperCase()
        : "U";

    return (
        <header
            style={{
                height: "64px",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid var(--border-color, #e2e8f0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 1.5rem",
                position: "sticky",
                top: 0,
                zIndex: 40
            }}
        >
            {/* Left Header Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                    onClick={onMobileMenuToggle}
                    style={{
                        display: "none", // Managed via media-queries/classname overrides in CSS
                        background: "none",
                        border: "1px solid var(--gray-200, #e2e8f0)",
                        borderRadius: "var(--radius-md, 8px)",
                        padding: "0.5rem",
                        cursor: "pointer",
                        color: "var(--gray-600, #475569)"
                    }}
                    className="mobile-menu-btn"
                    aria-label="Toggle Navigation"
                >
                    <Menu size={20} />
                </button>

                <h1
                    style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "var(--gray-900, #0f172a)",
                        lineHeight: 1.2
                    }}
                >
                    {title || "Dashboard"}
                </h1>
            </div>

            {/* Right Header Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <NotificationsDropdown />

                {/* Profile Container */}
                <div style={{ position: "relative" }} ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.625rem",
                            background: "none",
                            border: "1px solid var(--gray-200, #e2e8f0)",
                            borderRadius: "var(--radius-full, 9999px)",
                            padding: "0.25rem 0.75rem 0.25rem 0.25rem",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            backgroundColor: isProfileOpen ? "var(--gray-50, #f8fafc)" : "#ffffff"
                        }}
                    >
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "var(--radius-full, 9999px)",
                                backgroundColor: "var(--primary-600, #4f46e5)",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "0.875rem"
                            }}
                        >
                            {userInitial}
                        </div>

                        <div
                            style={{ textAlign: "left", display: "none" }}
                            className="user-text-info" // Un-hidden by desktop media layout targets
                        >
                            <span
                                style={{
                                    display: "block",
                                    fontSize: "0.8125rem",
                                    fontWeight: 700,
                                    color: "var(--gray-800, #1e293b)",
                                    lineHeight: 1.1
                                }}
                            >
                                {user?.name || "User"}
                            </span>
                            <span style={{ fontSize: "0.6875rem", color: "var(--gray-500, #64748b)" }}>
                                {formatRole(user?.role)}
                            </span>
                        </div>

                        <ChevronDown size={14} style={{ color: "var(--gray-400, #94a3b8)" }} />
                    </button>

                    {/* Profile Dropdown Overlays */}
                    {isProfileOpen && (
                        <div
                            className="animate-fade-in"
                            style={{
                                position: "absolute",
                                right: 0,
                                top: "calc(100% + 0.5rem)",
                                width: "230px",
                                backgroundColor: "#ffffff",
                                borderRadius: "var(--radius-lg, 12px)",
                                boxShadow: "var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1))",
                                border: "1px solid var(--border-color, #e2e8f0)",
                                zIndex: 1000,
                                overflow: "hidden",
                                padding: "0.5rem"
                            }}
                        >
                            {/* User details header text summary */}
                            <div
                                style={{
                                    padding: "0.75rem",
                                    borderBottom: "1px solid var(--gray-100, #f1f5f9)",
                                    marginBottom: "0.375rem"
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: 700,
                                        color: "var(--gray-900, #0f172a)",
                                        margin: 0
                                    }}
                                >
                                    {user?.name || "User Profile"}
                                </p>
                                <p
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--gray-500, #64748b)",
                                        margin: "2px 0 0 0",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {user?.email || "No email assigned"}
                                </p>
                            </div>

                            {/* Dropdown Options */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.625rem",
                                        padding: "0.625rem 0.75rem",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: "var(--gray-700, #334155)",
                                        textDecoration: "none",
                                        borderRadius: "var(--radius-md, 6px)",
                                        transition: "background 0.15s ease"
                                    }}
                                    className="dropdown-item"
                                >
                                    <User size={16} />
                                    <span>My Profile</span>
                                </Link>

                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        onLogoutRequest(); // Triggers ConfirmDialog confirmation modal safely
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.625rem",
                                        padding: "0.625rem 0.75rem",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: "var(--danger-600, #dc2626)",
                                        border: "none",
                                        background: "none",
                                        width: "100%",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        borderRadius: "var(--radius-md, 6px)",
                                        transition: "background 0.15s ease"
                                    }}
                                    className="dropdown-item danger"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};