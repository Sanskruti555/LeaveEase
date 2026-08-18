import React from "react";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export const Table = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "No records found",
    emptyDescription = "There are no items matching your criteria.",
    emptyIcon,
    onRowClick,
    keyExtractor = (row, index) => row.id || row.user_id || row.request_id || row.branch_id || row.leave_type_id || index
}) => {
    return (
        <div
            style={{
                width: "100%",
                overflowX: "auto",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "#ffffff",
                boxShadow: "var(--shadow-sm)"
            }}
        >
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    fontSize: "0.875rem"
                }}
            >
                <thead>
                    <tr
                        style={{
                            backgroundColor: "var(--gray-50)",
                            borderBottom: "1px solid var(--border-color)"
                        }}
                    >
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                style={{
                                    padding: "0.875rem 1rem",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    color: "var(--gray-500)",
                                    width: col.width || "auto",
                                    textAlign: col.align || "left"
                                }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                {columns.map((_, cIdx) => (
                                    <td key={cIdx} style={{ padding: "1rem" }}>
                                        <Skeleton height="1.25rem" width={cIdx === 0 ? "70%" : "90%"} />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ padding: "3rem 1rem" }}>
                                <EmptyState
                                    icon={emptyIcon}
                                    title={emptyMessage}
                                    description={emptyDescription}
                                />
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rIdx) => (
                            <tr
                                key={keyExtractor(row, rIdx)}
                                onClick={() => onRowClick && onRowClick(row)}
                                style={{
                                    borderBottom: "1px solid var(--border-color)",
                                    cursor: onRowClick ? "pointer" : "default",
                                    transition: "background-color 0.12s ease"
                                }}
                                onMouseEnter={(e) => {
                                    if (onRowClick) {
                                        e.currentTarget.style.backgroundColor = "var(--gray-50)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (onRowClick) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                    }
                                }}
                            >
                                {columns.map((col, cIdx) => (
                                    <td
                                        key={cIdx}
                                        style={{
                                            padding: "0.875rem 1rem",
                                            color: "var(--gray-800)",
                                            textAlign: col.align || "left"
                                        }}
                                    >
                                        {col.render
                                            ? col.render(row[col.accessor], row, rIdx)
                                            : row[col.accessor] !== undefined && row[col.accessor] !== null
                                            ? row[col.accessor]
                                            : "-"}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
