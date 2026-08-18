import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const AuthLayout = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--surface-bg)",
                padding: "2rem 1rem"
            }}
        >
            {/* Header Brand */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "2rem"
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--primary-600)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.25)"
                    }}
                >
                    <Sparkles size={22} />
                </div>
                <span
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-heading)",
                        color: "var(--gray-900)",
                        letterSpacing: "-0.03em"
                    }}
                >
                    LeaveEase
                </span>
            </div>

            {/* Auth Form Card Container */}
            <div
                className="animate-fade-in"
                style={{
                    width: "100%",
                    maxWidth: "460px",
                    backgroundColor: "#ffffff",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-lg)",
                    border: "1px solid var(--border-color)",
                    padding: "2.25rem 2rem"
                }}
            >
                <Outlet />
            </div>

            {/* Footer Notice */}
            <div
                style={{
                    marginTop: "2rem",
                    fontSize: "0.8125rem",
                    color: "var(--gray-400)",
                    textAlign: "center"
                }}
            >
                &copy; {new Date().getFullYear()} LeaveEase Enterprise Management. All rights reserved.
            </div>
        </div>
    );
};
