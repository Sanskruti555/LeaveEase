import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Clock, FileText, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { formatDateTime } from "../../utils/formatters";

export const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case "LEAVE_APPROVED":
                return <CheckCircle2 size={16} style={{ color: "var(--success-600)" }} />;
            case "LEAVE_REJECTED":
                return <XCircle size={16} style={{ color: "var(--danger-600)" }} />;
            case "LEAVE_CANCELLED":
                return <AlertCircle size={16} style={{ color: "var(--warning-600)" }} />;
            case "LEAVE_APPLIED":
            default:
                return <FileText size={16} style={{ color: "var(--primary-600)" }} />;
        }
    };

    const formatNotificationTitle = (type) => {
        switch (type) {
            case "LEAVE_APPROVED":
                return "Leave Request Approved";
            case "LEAVE_REJECTED":
                return "Leave Request Rejected";
            case "LEAVE_CANCELLED":
                return "Leave Request Cancelled";
            case "LEAVE_APPLIED":
                return "New Leave Request Submitted";
            default:
                return type ? type.replace(/_/g, " ") : "Notification";
        }
    };

    return (
        <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "relative",
                    background: "none",
                    border: "1px solid var(--gray-200)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gray-600)",
                    backgroundColor: isOpen ? "var(--gray-100)" : "#ffffff",
                    transition: "all 0.15s ease"
                }}
                aria-label="Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "-4px",
                            right: "-4px",
                            backgroundColor: "var(--danger-500)",
                            color: "#ffffff",
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            minWidth: "18px",
                            height: "18px",
                            borderRadius: "var(--radius-full)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 4px",
                            boxShadow: "0 0 0 2px #ffffff"
                        }}
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    className="animate-fade-in"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 0.5rem)",
                        width: "340px",
                        maxWidth: "calc(100vw - 2rem)",
                        backgroundColor: "#ffffff",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "var(--shadow-xl)",
                        border: "1px solid var(--border-color)",
                        zIndex: 1000,
                        overflow: "hidden"
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: "0.875rem 1rem",
                            borderBottom: "1px solid var(--border-color)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "var(--gray-50)"
                        }}
                    >
                        <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--gray-900)" }}>
                            Notifications
                        </span>
                        {unreadCount > 0 && (
                            <span
                                style={{
                                    fontSize: "0.6875rem",
                                    fontWeight: 600,
                                    color: "var(--primary-700)",
                                    backgroundColor: "var(--primary-50)",
                                    padding: "0.125rem 0.5rem",
                                    borderRadius: "var(--radius-full)"
                                }}
                            >
                                {unreadCount} unread
                            </span>
                        )}
                    </div>

                    {/* List */}
                    <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                        {notifications.length === 0 ? (
                            <div
                                style={{
                                    padding: "2rem 1rem",
                                    textAlign: "center",
                                    color: "var(--gray-400)",
                                    fontSize: "0.8125rem"
                                }}
                            >
                                <CheckCheck size={28} style={{ margin: "0 auto 0.5rem", display: "block", color: "var(--gray-300)" }} />
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((item) => (
                                <div
                                    key={item.notification_id}
                                    onClick={() => {
                                        if (!item.is_read) {
                                            markAsRead(item.notification_id);
                                        }
                                    }}
                                    style={{
                                        padding: "0.875rem 1rem",
                                        borderBottom: "1px solid var(--gray-100)",
                                        display: "flex",
                                        gap: "0.75rem",
                                        alignItems: "flex-start",
                                        backgroundColor: item.is_read ? "#ffffff" : "var(--primary-50)",
                                        cursor: "pointer",
                                        transition: "background-color 0.15s ease"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "var(--radius-full)",
                                            backgroundColor: "#ffffff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            boxShadow: "var(--shadow-sm)"
                                        }}
                                    >
                                        {getNotificationIcon(item.notification_type)}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p
                                            style={{
                                                fontSize: "0.8125rem",
                                                fontWeight: item.is_read ? 500 : 700,
                                                color: "var(--gray-900)",
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {formatNotificationTitle(item.notification_type)}
                                        </p>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.25rem",
                                                marginTop: "0.25rem",
                                                fontSize: "0.6875rem",
                                                color: "var(--gray-400)"
                                            }}
                                        >
                                            <Clock size={11} />
                                            <span>{formatDateTime(item.created_at)}</span>
                                        </div>
                                    </div>

                                    {!item.is_read && (
                                        <span
                                            style={{
                                                width: "7px",
                                                height: "7px",
                                                borderRadius: "var(--radius-full)",
                                                backgroundColor: "var(--primary-600)",
                                                flexShrink: 0,
                                                marginTop: "5px"
                                            }}
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
