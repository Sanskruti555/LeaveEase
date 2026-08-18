import React from "react";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false
}) => {
    const getIcon = () => {
        switch (variant) {
            case "danger":
                return (
                    <div
                        style={{
                            width: "2.75rem",
                            height: "2.75rem",
                            borderRadius: "var(--radius-full)",
                            backgroundColor: "var(--danger-50)",
                            color: "var(--danger-600)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                    >
                        <AlertTriangle size={22} />
                    </div>
                );
            case "success":
                return (
                    <div
                        style={{
                            width: "2.75rem",
                            height: "2.75rem",
                            borderRadius: "var(--radius-full)",
                            backgroundColor: "var(--success-50)",
                            color: "var(--success-600)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                    >
                        <CheckCircle2 size={22} />
                    </div>
                );
            default:
                return (
                    <div
                        style={{
                            width: "2.75rem",
                            height: "2.75rem",
                            borderRadius: "var(--radius-full)",
                            backgroundColor: "var(--primary-50)",
                            color: "var(--primary-600)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                    >
                        <Info size={22} />
                    </div>
                );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="440px"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === "danger" ? "danger" : variant === "success" ? "success" : "primary"}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                {getIcon()}
                <div>
                    <h4
                        style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "var(--gray-900)",
                            marginBottom: "0.25rem"
                        }}
                    >
                        {title}
                    </h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", lineHeight: 1.5 }}>
                        {message}
                    </p>
                </div>
            </div>
        </Modal>
    );
};
