import React from "react";
import { ChevronDown } from "lucide-react";

export const Select = ({
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    id,
    name,
    value,
    onChange,
    options = [],
    children,
    placeholder = "Select an option",
    style = {},
    selectStyle = {},
    ...props
}) => {
    const selectId = id || name || Math.random().toString(36).substr(2, 9);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", width: "100%", ...style }}>
            {label && (
                <label
                    htmlFor={selectId}
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
                <select
                    id={selectId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    style={{
                        width: "100%",
                        padding: "0.5625rem 2.25rem 0.5625rem 0.875rem",
                        fontSize: "0.875rem",
                        fontFamily: "var(--font-body)",
                        color: value ? "var(--gray-900)" : "var(--gray-400)",
                        backgroundColor: disabled ? "var(--gray-100)" : "#ffffff",
                        border: error ? "1px solid var(--danger-500)" : "1px solid var(--gray-300)",
                        borderRadius: "var(--radius-md)",
                        outline: "none",
                        appearance: "none",
                        cursor: disabled ? "not-allowed" : "pointer",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        ...selectStyle
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
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.length > 0
                        ? options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                  {opt.label}
                              </option>
                          ))
                        : children}
                </select>

                <ChevronDown
                    size={16}
                    style={{
                        position: "absolute",
                        right: "0.875rem",
                        color: "var(--gray-400)",
                        pointerEvents: "none"
                    }}
                />
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
