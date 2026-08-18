import React from "react";

export const Badge = ({
    children,
    status,
    variant,
    size = "sm",
    style = {}
}) => {
    const getStyles = () => {
        const val = (status || variant || children || "").toString().toUpperCase();

        switch (val) {
            case "APPROVED":
            case "ACTIVE":
            case "ACCEPTED":
            case "SUCCESS":
                return {
                    backgroundColor: "var(--success-50)",
                    color: "var(--success-700)",
                    border: "1px solid var(--success-100)"
                };
            case "PENDING":
            case "WARNING":
                return {
                    backgroundColor: "var(--warning-50)",
                    color: "var(--warning-700)",
                    border: "1px solid var(--warning-100)"
                };
            case "REJECTED":
            case "INACTIVE":
            case "CANCELLED":
            case "EXPIRED":
            case "DANGER":
                return {
                    backgroundColor: "var(--danger-50)",
                    color: "var(--danger-700)",
                    border: "1px solid var(--danger-100)"
                };
            case "SUPER_ADMIN":
                return {
                    backgroundColor: "var(--primary-50)",
                    color: "var(--primary-700)",
                    border: "1px solid var(--primary-200)"
                };
            case "BRANCH_ADMIN":
                return {
                    backgroundColor: "#f3e8ff",
                    color: "#6b21a8",
                    border: "1px solid #e9d5ff"
                };
            case "MANAGER":
                return {
                    backgroundColor: "#e0f2fe",
                    color: "#0369a1",
                    border: "1px solid #bae6fd"
                };
            case "EMPLOYEE":
                return {
                    backgroundColor: "var(--gray-100)",
                    color: "var(--gray-700)",
                    border: "1px solid var(--gray-200)"
                };
            default:
                return {
                    backgroundColor: "var(--gray-100)",
                    color: "var(--gray-700)",
                    border: "1px solid var(--gray-200)"
                };
        }
    };

    const sizeStyle = size === "xs"
        ? { padding: "0.125rem 0.375rem", fontSize: "0.6875rem" }
        : { padding: "0.25rem 0.625rem", fontSize: "0.75rem" };

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                fontWeight: 600,
                borderRadius: "var(--radius-full)",
                letterSpacing: "0.02em",
                textTransform: "capitalize",
                fontFamily: "var(--font-heading)",
                ...sizeStyle,
                ...getStyles(),
                ...style
            }}
        >
            {children || (status ? status.toLowerCase() : "")}
        </span>
    );
};
