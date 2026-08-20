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
                background: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                borderRadius: "1.5rem",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
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
                        borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
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
                                    color: "var(--gray-950, #0f172a)"
                                }}
                            >
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p
                                style={{
                                    fontSize: "0.8125rem",
                                    color: "var(--gray-600, #475569)",
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
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        borderTop: "1px solid rgba(255, 255, 255, 0.4)",
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