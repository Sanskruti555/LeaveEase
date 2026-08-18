import React from "react";

export const Input = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    required = false,
    disabled = false,
    id,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    style = {},
    inputStyle = {},
    ...props
}) => {
    const inputId = id || name || Math.random().toString(36).substr(2, 9);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", width: "100%", ...style }}>
            {label && (
                <label
                    htmlFor={inputId}
                    style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--gray-700)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem"
                    }}
                >
                    {label}
                    {required && <span style={{ color: "var(--danger-600)" }}>*</span>}
                </label>
            )}

            <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                {leftIcon && (
                    <div
                        style={{
                            position: "absolute",
                            left: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            color: "var(--gray-400)",
                            pointerEvents: "none"
                        }}
                    >
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    style={{
                        width: "100%",
                        padding: "0.5625rem 0.875rem",
                        paddingLeft: leftIcon ? "2.5rem" : "0.875rem",
                        paddingRight: rightIcon ? "2.5rem" : "0.875rem",
                        fontSize: "0.875rem",
                        fontFamily: "var(--font-body)",
                        color: "var(--gray-900)",
                        backgroundColor: disabled ? "var(--gray-100)" : "#ffffff",
                        border: error ? "1px solid var(--danger-500)" : "1px solid var(--gray-300)",
                        borderRadius: "var(--radius-md)",
                        outline: "none",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        ...inputStyle
                    }}
                    onFocus={(e) => {
                        if (!error) {
                            e.target.style.borderColor = "var(--primary-500)";
                            e.target.style.boxShadow = "0 0 0 3px var(--primary-100)";
                        }
                    }}
                    onBlur={(e) => {
                        if (!error) {
                            e.target.style.borderColor = "var(--gray-300)";
                            e.target.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                        }
                    }}
                    {...props}
                />

                {rightIcon && (
                    <div
                        style={{
                            position: "absolute",
                            right: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            color: "var(--gray-400)"
                        }}
                    >
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <span style={{ fontSize: "0.75rem", color: "var(--danger-600)", fontWeight: 500 }}>
                    {error}
                </span>
            )}

            {!error && helperText && (
                <span style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                    {helperText}
                </span>
            )}
        </div>
    );
};
