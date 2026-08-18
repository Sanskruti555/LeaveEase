import React from "react";
import { FolderOpen } from "lucide-react";

export const EmptyState = ({
    icon,
    title = "No data found",
    description = "There are no items to display right now.",
    action = null,
    style = {}
}) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 1.5rem",
                textAlign: "center",
                ...style
            }}
        >
            <div
                style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--gray-100)",
                    color: "var(--gray-400)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem"
                }}
            >
                {icon || <FolderOpen size={28} />}
            </div>

            <h4
                style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "var(--gray-800)",
                    marginBottom: "0.25rem"
                }}
            >
                {title}
            </h4>

            <p
                style={{
                    fontSize: "0.875rem",
                    color: "var(--gray-500)",
                    maxWidth: "380px",
                    lineHeight: 1.5,
                    marginBottom: action ? "1.25rem" : 0
                }}
            >
                {description}
            </p>

            {action && <div>{action}</div>}
        </div>
    );
};
