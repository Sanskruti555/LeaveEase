export const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
};

export const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const formatDuration = (days, durationType) => {
    if (durationType === "HALF_DAY") {
        return "Half Day (0.5d)";
    }
    const num = Number(days);
    if (isNaN(num)) return "-";
    return `${num} ${num === 1 ? "Day" : "Days"}`;
};

export const formatRole = (role) => {
    switch (role) {
        case "SUPER_ADMIN":
            return "Super Admin";
        case "BRANCH_ADMIN":
            return "Branch Admin";
        case "MANAGER":
            return "Manager";
        case "EMPLOYEE":
            return "Employee";
        default:
            return role || "-";
    }
};

export const formatFrequency = (freq) => {
    switch (freq) {
        case "MONTHLY":
            return "Monthly";
        case "QUARTERLY":
            return "Quarterly";
        case "HALF_YEARLY":
            return "Half-Yearly";
        case "YEARLY":
            return "Yearly";
        case "ONCE":
        case "ONE_TIME":
            return "One-Time";
        default:
            return freq || "-";
    }
};
