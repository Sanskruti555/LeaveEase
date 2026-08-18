import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange
}) => {
    if (totalPages <= 1 && totalItems <= pageSize) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.875rem 1.25rem",
                backgroundColor: "#ffffff",
                borderTop: "1px solid var(--border-color)",
                flexWrap: "wrap",
                gap: "0.75rem"
            }}
        >
            <div style={{ fontSize: "0.8125rem", color: "var(--gray-500)" }}>
                Showing <strong style={{ color: "var(--gray-800)" }}>{totalItems > 0 ? startItem : 0}</strong> to{" "}
                <strong style={{ color: "var(--gray-800)" }}>{endItem}</strong> of{" "}
                <strong style={{ color: "var(--gray-800)" }}>{totalItems}</strong> entries
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    leftIcon={<ChevronLeft size={16} />}
                >
                    Previous
                </Button>

                <div
                    style={{
                        padding: "0 0.5rem",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--gray-700)"
                    }}
                >
                    Page {currentPage} of {totalPages || 1}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    rightIcon={<ChevronRight size={16} />}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
