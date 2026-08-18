import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "../../components/common/Button";

export const Unauthorized = () => {
    return (
        <div
            style={{
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "2rem"
            }}
        >
            <div
                style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--danger-50)",
                    color: "var(--danger-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem"
                }}
            >
                <ShieldAlert size={32} />
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
                Access Denied
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "var(--gray-500)", maxWidth: "420px", marginBottom: "1.75rem" }}>
                You do not have the required permissions or role to view this page. If you believe this is an error, contact your administrator.
            </p>

            <Link to="/">
                <Button variant="primary" leftIcon={<ArrowLeft size={16} />}>
                    Return to Safe Dashboard
                </Button>
            </Link>
        </div>
    );
};
