import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    Building2, 
    CalendarDays, 
    Users, 
    Mail, 
    Settings, 
    LogOut,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    FileText
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const DashboardLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const getNavLinksForRole = (role) => {
        switch (role) {
            case "SUPER_ADMIN":
                return [
                    { path: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
                    { path: "/admin/branches", icon: <Building2 size={20} />, label: "Branches" },
                    { path: "/admin/leave-types", icon: <CalendarDays size={20} />, label: "Leave Types" },
                    { path: "/admin/users", icon: <Users size={20} />, label: "Users Management" },
                    { path: "/admin/invitations", icon: <Mail size={20} />, label: "Invitations" },
                    { path: "/profile", icon: <Settings size={20} />, label: "Profile & Settings" },
                ];
            case "BRANCH_ADMIN":
                return [
                    { path: "/branch/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
                    { path: "/branch/users", icon: <Users size={20} />, label: "Staff Management" },
                    { path: "/branch/invitations", icon: <Mail size={20} />, label: "Invitations" },
                    { path: "/profile", icon: <Settings size={20} />, label: "Profile & Settings" },
                ];
            case "MANAGER":
                return [
                    { path: "/manager/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
                    { path: "/manager/team", icon: <Users size={20} />, label: "My Team" },
                    { path: "/manager/leave-requests", icon: <FileText size={20} />, label: "Leave Requests" },
                    { path: "/manager/invite", icon: <Mail size={20} />, label: "Invite Staff" },
                    { path: "/profile", icon: <Settings size={20} />, label: "Profile & Settings" },
                ];
            case "EMPLOYEE":
                return [
                    { path: "/employee/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
                    { path: "/employee/apply-leave", icon: <CalendarDays size={20} />, label: "Apply Leave" },
                    { path: "/employee/my-leaves", icon: <FileText size={20} />, label: "My Leaves" },
                    { path: "/employee/balances", icon: <LayoutDashboard size={20} />, label: "Balances" },
                    { path: "/profile", icon: <Settings size={20} />, label: "Profile & Settings" },
                ];
            default:
                return [];
        }
    };

    const navLinks = getNavLinksForRole(user?.role);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="sidebar-layout">
            {/* Frosted Dark Floating Sidebar */}
            <aside className={`floating-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                
                {/* Header / Brand & Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1rem', gap: '0.75rem', justifyContent: isCollapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    {!isCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.125rem', color: '#ffffff' }}>
                            <Sparkles size={20} color="#4ade80" /> LeaveEase
                        </div>
                    )}
                    {isCollapsed && <Sparkles size={20} color="#4ade80" />}
                    
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#94a3b8' }}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="sidebar-content">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            title={isCollapsed ? link.label : ""}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', width: isCollapsed ? '100%' : 'auto' }}>
                                {link.icon}
                            </div>
                            {!isCollapsed && <span>{link.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer / Logout */}
                <div style={{ padding: '0.875rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <button onClick={handleLogout} className="nav-item" style={{ color: '#f87171' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', width: isCollapsed ? '100%' : 'auto' }}>
                            <LogOut size={20} />
                        </div>
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`main-content-wrapper ${isCollapsed ? 'collapsed-margin' : 'expanded-margin'}`}>
                <Outlet />
            </main>
        </div>
    );
};