import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    leftIcon = null,
    rightIcon = null,
    onClick,
    className = "",
    style = {},
    ...props
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case "primary":
                return {
                    backgroundColor: "var(--primary-600)",
                    color: "#ffffff",
                    border: "1px solid var(--primary-600)",
                    boxShadow: "0 1px 2px 0 rgba(79, 70, 229, 0.2)"
                };
            case "secondary":
                return {
                    backgroundColor: "var(--gray-100)",
                    color: "var(--gray-700)",
                    border: "1px solid var(--gray-300)"
                };
            case "outline":
                return {
                    backgroundColor: "transparent",
                    color: "var(--gray-700)",
                    border: "1px solid var(--gray-300)"
                };
            case "danger":
                return {
                    backgroundColor: "var(--danger-600)",
                    color: "#ffffff",
                    border: "1px solid var(--danger-600)",
                    boxShadow: "0 1px 2px 0 rgba(220, 38, 38, 0.2)"
                };
            case "success":
                return {
                    backgroundColor: "var(--success-600)",
                    color: "#ffffff",
                    border: "1px solid var(--success-600)",
                    boxShadow: "0 1px 2px 0 rgba(5, 150, 105, 0.2)"
                };
            case "ghost":
                return {
                    backgroundColor: "transparent",
                    color: "var(--gray-600)",
                    border: "1px solid transparent"
                };
            default:
                return {};
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case "sm":
                return {
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.8125rem",
                    borderRadius: "var(--radius-sm)",
                    gap: "0.375rem"
                };
            case "lg":
                return {
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    borderRadius: "var(--radius-md)",
                    gap: "0.625rem"
                };
            case "md":
            default:
                return {
                    padding: "0.5625rem 1.125rem",
                    fontSize: "0.875rem",
                    borderRadius: "var(--radius-md)",
                    gap: "0.5rem"
                };
        }
    };

    const baseStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontFamily: "var(--font-heading)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.65 : 1,
        transition: "all 0.15s ease-in-out",
        textDecoration: "none",
        userSelect: "none",
        outline: "none",
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...style
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            style={baseStyle}
            className={className}
            {...props}
        >
            {loading && <Loader2 className="animate-spin" size={size === "sm" ? 14 : 16} />}
            {!loading && leftIcon && leftIcon}
            <span>{children}</span>
            {!loading && rightIcon && rightIcon}
        </button>
    );
};
