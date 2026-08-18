import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    maxWidth = "550px"
}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem"
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(15, 23, 42, 0.55)",
                    backdropFilter: "blur(4px)",
                    transition: "opacity 0.2s ease"
                }}
            />

            {/* Modal Box */}
            <div
                className="animate-fade-in"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth,
                    backgroundColor: "#ffffff",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-xl)",
                    border: "1px solid var(--border-color)",
                    maxHeight: "calc(100vh - 4rem)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    zIndex: 1000
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "1.25rem 1.5rem",
                        borderBottom: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <div>
                        {title && (
                            <h3
                                style={{
                                    fontSize: "1.125rem",
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
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "0.375rem",
                            borderRadius: "var(--radius-sm)",
                            color: "var(--gray-400)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--gray-100)";
                            e.currentTarget.style.color = "var(--gray-700)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "var(--gray-400)";
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div
                    style={{
                        padding: "1.5rem",
                        overflowY: "auto",
                        flex: 1
                    }}
                >
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        style={{
                            padding: "1rem 1.5rem",
                            backgroundColor: "var(--gray-50)",
                            borderTop: "1px solid var(--border-color)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: "0.75rem"
                        }}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
