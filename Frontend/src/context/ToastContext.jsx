import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = "success", duration = 4000) => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        const newToast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    const getIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle2 style={{ width: "20px", height: "20px", color: "var(--success-600)" }} />;
            case "error":
                return <AlertCircle style={{ width: "20px", height: "20px", color: "var(--danger-600)" }} />;
            case "warning":
                return <AlertTriangle style={{ width: "20px", height: "20px", color: "var(--warning-600)" }} />;
            default:
                return <Info style={{ width: "20px", height: "20px", color: "var(--primary-600)" }} />;
        }
    };

    const getToastStyle = (type) => {
        switch (type) {
            case "success":
                return {
                    borderLeft: "4px solid var(--success-500)",
                    backgroundColor: "white",
                    color: "var(--gray-800)"
                };
            case "error":
                return {
                    borderLeft: "4px solid var(--danger-500)",
                    backgroundColor: "white",
                    color: "var(--gray-800)"
                };
            case "warning":
                return {
                    borderLeft: "4px solid var(--warning-500)",
                    backgroundColor: "white",
                    color: "var(--gray-800)"
                };
            default:
                return {
                    borderLeft: "4px solid var(--primary-500)",
                    backgroundColor: "white",
                    color: "var(--gray-800)"
                };
        }
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div
                style={{
                    position: "fixed",
                    top: "1.5rem",
                    right: "1.5rem",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    maxWidth: "400px",
                    width: "calc(100% - 3rem)",
                    pointerEvents: "none"
                }}
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="animate-fade-in"
                        style={{
                            ...getToastStyle(toast.type),
                            pointerEvents: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.875rem 1rem",
                            borderRadius: "var(--radius-md)",
                            boxShadow: "var(--shadow-lg)",
                            gap: "0.75rem",
                            border: "1px solid var(--gray-200)",
                            fontSize: "0.875rem",
                            fontWeight: 500
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            {getIcon(toast.type)}
                            <span>{toast.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--gray-400)",
                                display: "flex",
                                alignItems: "center",
                                padding: "2px"
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
