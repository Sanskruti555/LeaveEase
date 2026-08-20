import React, { useState } from "react";
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
    Sparkles,
    ChevronLeft,
    ChevronRight,
    LogOut
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { formatRole } from "../../utils/formatters";

export const Sidebar = ({
    isMobileOpen,
    onCloseMobile,
    onLogoutRequest
}) => {
    const { user, role } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

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
                        backgroundColor: "rgba(15, 23, 42, 0.4)",
                        zIndex: 49,
                        backdropFilter: "blur(2px)"
                    }}
                />
            )}

            {/* Glassmorphic Sidebar Container */}
            <aside
                className={`sidebar ${isMobileOpen ? "mobile-open" : ""}`}
                style={{
                    width: isCollapsed ? "80px" : "260px",
                    background: "rgba(255, 255, 255, 0.45)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.6)",
                    boxShadow: "20px 0 40px rgba(0, 0, 0, 0.04), inset -1px 0 0 rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    flexDirection: "column",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    zIndex: 50,
                    transition: "width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.25s ease-in-out",
                    color: "var(--gray-900, #0f172a)"
                }}
            >
                {/* Brand Logo Section */}
                <div
                    style={{
                        height: "64px",
                        padding: "0 1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "space-between",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.4)"
                    }}
                >
                    {!isCollapsed ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                            <div
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "8px",
                                    backgroundColor: "#2d6a4f",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#ffffff",
                                    boxShadow: "0 2px 4px rgba(45, 106, 79, 0.3)"
                                }}
                            >
                                <Sparkles size={18} />
                            </div>
                            <span
                                style={{
                                    fontSize: "1.125rem",
                                    fontWeight: 800,
                                    color: "var(--gray-900, #0f172a)",
                                    letterSpacing: "-0.02em"
                                }}
                            >
                                LeaveEase
                            </span>
                        </div>
                    ) : (
                        <Sparkles size={20} color="#2d6a4f" />
                    )}

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--gray-600, #475569)",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
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
                            onClick={onCloseMobile}
                            title={isCollapsed ? item.label : ""}
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                            style={({ isActive }) => ({
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.75rem 1rem",
                                borderRadius: "10px",
                                fontSize: "0.925rem",
                                fontWeight: isActive ? 700 : 500,
                                textDecoration: "none",
                                color: isActive ? "#1b4332" : "var(--gray-700, #334155)",
                                backgroundColor: isActive ? "rgba(255, 255, 255, 0.85)" : "transparent",
                                boxShadow: isActive ? "0 4px 15px rgba(0, 0, 0, 0.05)" : "none",
                                transition: "all 0.2s ease",
                                justifyContent: isCollapsed ? "center" : "flex-start"
                            })}
                        >
                            <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
                            {!isCollapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Summary Card & Manual Logout Button */}
                <div
                    style={{
                        padding: "1rem 0.75rem",
                        borderTop: "1px solid rgba(255, 255, 255, 0.4)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                    }}
                >
                    {user && !isCollapsed && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.5rem 0.75rem",
                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                                borderRadius: "10px",
                                border: "1px solid rgba(255, 255, 255, 0.5)"
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    backgroundColor: "#2d6a4f",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 600,
                                    color: "#ffffff"
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
                                        color: "var(--gray-600, #475569)"
                                    }}
                                >
                                    {formatRole(role)}
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onLogoutRequest}
                        title={isCollapsed ? "Logout" : ""}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isCollapsed ? "center" : "flex-start",
                            gap: "0.75rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "10px",
                            fontSize: "0.925rem",
                            fontWeight: 500,
                            border: "none",
                            background: "none",
                            color: "var(--danger-600, #dc2626)",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                        }}
                    >
                        <LogOut size={18} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};