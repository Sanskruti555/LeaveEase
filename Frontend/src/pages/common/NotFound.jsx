import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "../../components/common/Button";

export const NotFound = () => {
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
                    backgroundColor: "var(--gray-100)",
                    color: "var(--gray-500)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem"
                }}
            >
                <HelpCircle size={32} />
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
                Page Not Found
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "var(--gray-500)", maxWidth: "420px", marginBottom: "1.75rem" }}>
                The page you are looking for doesn't exist, has been removed, or you don't have permission to access it.
            </p>

            <Link to="/">
                <Button variant="primary" leftIcon={<ArrowLeft size={16} />}>
                    Return to Dashboard
                </Button>
            </Link>
        </div>
    );
};
