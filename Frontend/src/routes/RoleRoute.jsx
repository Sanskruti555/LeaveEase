import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export const RoleRoute = ({ allowedRoles = [], children }) => {
    const { user, isAuthenticated, loading, role } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary-600)"
                }}
            >
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
};
