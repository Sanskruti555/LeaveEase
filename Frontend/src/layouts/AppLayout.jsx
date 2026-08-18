import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { ConfirmDialog } from "../components/common/ConfirmDialog";

import { useAuth } from "../context/AuthContext";

export const AppLayout = ({ title }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const { logout, role, userRole } = useAuth();
    const activeRole = role || userRole; 
    const location = useLocation();

    /*
     * ✅ 15-MINUTE ADMIN INACTIVITY TIMEOUT
     * Automatically logs out administrative staff if they walk away from the dashboard.
     */
    useEffect(() => {
        const privilegedRoles = ["SUPER_ADMIN", "BRANCH_ADMIN", "MANAGER"];
        const isAdminSession = privilegedRoles.includes(activeRole);

        if (!isAdminSession) return;

        let inactivityTimer;
        const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 Minutes

        const performAutoLogout = async () => {
            try {
                setLogoutLoading(true);
                await logout();
            } catch (error) {
                console.error("Inactivity auto-logout failed:", error);
            } finally {
                setLogoutLoading(false);
                setShowLogoutDialog(false);
            }
        };

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(performAutoLogout, TIMEOUT_DURATION);
        };

        // Listen for active, natural physical user interactions
        window.addEventListener("mousemove", resetInactivityTimer);
        window.addEventListener("keydown", resetInactivityTimer);
        window.addEventListener("click", resetInactivityTimer);
        window.addEventListener("scroll", resetInactivityTimer);

        resetInactivityTimer();

        return () => {
            clearTimeout(inactivityTimer);
            window.removeEventListener("mousemove", resetInactivityTimer);
            window.removeEventListener("keydown", resetInactivityTimer);
            window.removeEventListener("click", resetInactivityTimer);
            window.removeEventListener("scroll", resetInactivityTimer);
        };
    }, [logout, activeRole]);

    /*
     * Called by Sidebar/Header when user explicitly clicks Logout button.
     */
    const handleLogoutRequest = () => {
        setShowLogoutDialog(true);
    };

    /*
     * User chose Cancel.
     */
    const handleCancelLogout = () => {
        setShowLogoutDialog(false);
    };

    /*
     * User confirmed Logout.
     */
    const handleConfirmLogout = async () => {
        try {
            setLogoutLoading(true);
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLogoutLoading(false);
            setShowLogoutDialog(false);
        }
    };

    return (
        <div className="app-container">
            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
                onLogoutRequest={handleLogoutRequest}
            />

            <div className="main-content">
                <Header
                    onMobileMenuToggle={() =>
                        setIsMobileMenuOpen(!isMobileMenuOpen)
                    }
                    title={title}
                    onLogoutRequest={handleLogoutRequest}
                />

                <main className="page-wrapper animate-fade-in">
                    <Outlet />
                </main>
            </div>

            <ConfirmDialog
                isOpen={showLogoutDialog}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
                title="You're currently logged in"
                message="Do you want to log out and return to the login page?"
                confirmText="Logout"
                cancelText="Cancel"
                variant="danger"
                loading={logoutLoading}
            />
        </div>
    );
};