import React from "react";

export const Card = ({
    children,
    title,
    subtitle,
    action,
    footer,
    style = {},
    headerStyle = {},
    bodyStyle = {},
    className = ""
}) => {
    return (
        <div
            className={className}
            style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                ...style
            }}
        >
            {(title || subtitle || action) && (
                <div
                    style={{
                        padding: "1.25rem 1.5rem",
                        borderBottom: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "0.75rem",
                        ...headerStyle
                    }}
                >
                    <div>
                        {title && (
                            <h3
                                style={{
                                    fontSize: "1.0625rem",
                                    fontWeight: 700,
                                    color: "var(--gray-900)"
                                }}
                            >
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p
                                style={{
                                    fontSize: "0.8125rem",
                                    color: "var(--gray-500)",
                                    marginTop: "0.125rem"
                                }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}

            <div style={{ padding: "1.5rem", flex: 1, ...bodyStyle }}>
                {children}
            </div>

            {footer && (
                <div
                    style={{
                        padding: "1rem 1.5rem",
                        backgroundColor: "var(--gray-50)",
                        borderTop: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end"
                    }}
                >
                    {footer}
                </div>
            )}
        </div>
    );
};
