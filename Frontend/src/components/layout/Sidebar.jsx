import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Layers,
    Users,
    Mail,
    User,
    CheckSquare,
    UserPlus,
    CalendarPlus,
    Calendar,
    PieChart,
    LogOut,
    Sparkles,
    X
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { formatRole } from "../../utils/formatters";

export const Sidebar = ({
    isMobileOpen,
    onCloseMobile,
    onLogoutRequest
}) => {
    const { user, role } = useAuth();

    const getNavItems = () => {
        switch (role) {
            case "SUPER_ADMIN":
                return [
                    { label: "Dashboard", to: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
                    { label: "Branches", to: "/admin/branches", icon: <Building2 size={18} /> },
                    { label: "Leave Types", to: "/admin/leave-types", icon: <Layers size={18} /> },
                    { label: "Users Management", to: "/admin/users", icon: <Users size={18} /> },
                    { label: "Invitations", to: "/admin/invitations", icon: <Mail size={18} /> },
                    { label: "Profile & Settings", to: "/profile", icon: <User size={18} /> }
                ];
            case "BRANCH_ADMIN":
                return [
                    { label: "Dashboard", to: "/branch/dashboard", icon: <LayoutDashboard size={18} /> },
                    { label: "Branch Users", to: "/branch/users", icon: <Users size={18} /> },
                    { label: "Invitations", to: "/branch/invitations", icon: <Mail size={18} /> },
                    { label: "Leave Types", to: "/branch/leave-types", icon: <Layers size={18} /> },
                    { label: "Profile & Settings", to: "/profile", icon: <User size={18} /> }
                ];
            case "MANAGER":
                return [
                    { label: "Dashboard", to: "/manager/dashboard", icon: <LayoutDashboard size={18} /> },
                    { label: "Leave Requests", to: "/manager/leave-requests", icon: <CheckSquare size={18} /> },
                    { label: "Team Members", to: "/manager/team", icon: <Users size={18} /> },
                    { label: "Invite Employee", to: "/manager/invite", icon: <UserPlus size={18} /> },
                    { label: "Leave Types", to: "/manager/leave-types", icon: <Layers size={18} /> },
                    { label: "Profile & Settings", to: "/profile", icon: <User size={18} /> }
                ];
            case "EMPLOYEE":
                return [
                    { label: "Dashboard", to: "/employee/dashboard", icon: <LayoutDashboard size={18} /> },
                    { label: "Apply Leave", to: "/employee/apply-leave", icon: <CalendarPlus size={18} /> },
                    { label: "My Leaves", to: "/employee/my-leaves", icon: <Calendar size={18} /> },
                    { label: "Leave Balances", to: "/employee/balances", icon: <PieChart size={18} /> },
                    { label: "Profile & Settings", to: "/profile", icon: <User size={18} /> }
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    onClick={onCloseMobile}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                        zIndex: 49,
                        backdropFilter: "blur(2px)"
                    }}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`sidebar ${isMobileOpen ? "mobile-open" : ""}`}
                style={{
                    width: "260px",
                    backgroundColor: "#ffffff",
                    borderRight: "1px solid var(--border-color, #e2e8f0)",
                    display: "flex",
                    flexDirection: "column",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    zIndex: 50,
                    transition: "transform 0.25s ease-in-out"
                }}
            >
                {/* Brand Logo Section */}
                <div
                    style={{
                        height: "64px",
                        padding: "0 1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid var(--border-color, #e2e8f0)"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div
                            style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "var(--radius-md, 8px)",
                                backgroundColor: "var(--primary-600, #4f46e5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                boxShadow: "0 2px 4px rgba(79, 70, 229, 0.3)"
                            }}
                        >
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <span
                                style={{
                                    fontSize: "1.125rem",
                                    fontWeight: 800,
                                    fontFamily: "var(--font-heading)",
                                    color: "var(--gray-900, #0f172a)",
                                    letterSpacing: "-0.02em"
                                }}
                            >
                                LeaveHub
                            </span>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onCloseMobile}
                        className="mobile-close-btn"
                        style={{
                            background: "none",
                            border: "none",
                            padding: "4px",
                            cursor: "pointer",
                            color: "var(--gray-500, #64748b)"
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Main Navigation Items */}
                <nav
                    style={{
                        flex: 1,
                        padding: "1.25rem 0.75rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        overflowY: "auto"
                    }}
                >
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            onClick={onCloseMobile} // Auto-close drawer layouts on mobile screen links
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.75rem 1rem",
                                borderRadius: "var(--radius-md, 8px)",
                                fontSize: "0.925rem",
                                fontWeight: 500,
                                textDecoration: "none",
                                color: "var(--gray-600, #475569)",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Summary Card & Manual Logout Button */}
                <div
                    style={{
                        padding: "1rem 0.75rem",
                        borderTop: "1px solid var(--border-color, #e2e8f0)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                    }}
                >
                    {user && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.5rem 0.75rem"
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    backgroundColor: "var(--gray-100, #f1f5f9)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 600,
                                    color: "var(--primary-600, #4f46e5)"
                                }}
                            >
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div style={{ overflow: "hidden" }}>
                                <div
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        color: "var(--gray-900, #0f172a)",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {user.name || "User"}
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--gray-500, #64748b)"
                                    }}
                                >
                                    {formatRole(role)}
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={onLogoutRequest}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-md, 8px)",
                            fontSize: "0.925rem",
                            fontWeight: 500,
                            border: "none",
                            background: "none",
                            color: "var(--danger-600, #dc2626)",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "background 0.2s ease"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};
