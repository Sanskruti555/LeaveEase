import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--surface-bg)",
                    color: "var(--primary-600)"
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <Loader2 className="animate-spin" size={36} style={{ margin: "0 auto 0.75rem" }} />
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", fontWeight: 500 }}>
                        Loading application...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children ? children : <Outlet />;
};
