import React from "react";

export const Skeleton = ({
    width = "100%",
    height = "1rem",
    borderRadius = "var(--radius-sm)",
    style = {}
}) => {
    return (
        <div
            style={{
                width,
                height,
                borderRadius,
                backgroundColor: "var(--gray-200)",
                animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                ...style
            }}
        />
    );
};
