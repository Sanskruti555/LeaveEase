import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    CalendarPlus,
    Calendar,
    Clock,
    FileText,
    Upload,
    AlertCircle,
    Info,
    CheckCircle2,
    X,
    ArrowLeft
} from "lucide-react";
import { leaveApi } from "../../api/leave.api";
import { leaveTypeApi } from "../../api/leaveType.api";
import { useToast } from "../../context/ToastContext";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";

export const ApplyLeave = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [leaveTypes, setLeaveTypes] = useState([]);
    const [balances, setBalances] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        duration_type: "FULL_DAY",
        reason: ""
    });

    const [attachment, setAttachment] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Load available leave types and active balances
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoadingData(true);
                const [typesRes, balancesRes] = await Promise.all([
                    leaveTypeApi.getLeaveTypes(),
                    leaveApi.getLeaveBalances()
                ]);

                if (typesRes.success && Array.isArray(typesRes.data)) {
                    // Filter only active leave types
                    const activeTypes = typesRes.data.filter((t) => t.status === "ACTIVE");
                    setLeaveTypes(activeTypes);
                    if (activeTypes.length > 0) {
                        setFormData((prev) => ({
                            ...prev,
                            leave_type_id: String(activeTypes[0].leave_type_id)
                        }));
                    }
                }

                if (balancesRes.success && Array.isArray(balancesRes.data)) {
                    setBalances(balancesRes.data);
                }
            } catch (err) {
                console.error("Failed to load leave types:", err);
                setFormError("Failed to load leave types. Please try again.");
            } finally {
                setLoadingData(false);
            }
        };

        loadInitialData();
    }, []);

    // Calculate requested duration
    const calculateDays = () => {
        if (!formData.start_date || !formData.end_date) return 0;
        if (formData.duration_type === "HALF_DAY") return 0.5;

        const start = new Date(formData.start_date);
        const end = new Date(formData.end_date);

        if (end < start) return 0;

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const requestedDays = calculateDays();

    // Find selected leave type details and balance
    const selectedType = leaveTypes.find(
        (t) => String(t.leave_type_id) === String(formData.leave_type_id)
    );

    const selectedBalance = balances.find(
        (b) => String(b.leave_type_id) === String(formData.leave_type_id)
    );

    const remainingBalance = selectedBalance ? Number(selectedBalance.remaining_balance) : null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const next = { ...prev, [name]: value };

            // If HALF_DAY selected, end_date must match start_date
            if (name === "duration_type" && value === "HALF_DAY" && prev.start_date) {
                next.end_date = prev.start_date;
            } else if (name === "start_date" && prev.duration_type === "HALF_DAY") {
                next.end_date = value;
            }

            return next;
        });

        if (formError) setFormError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                setFormError("Only PDF, JPG, and PNG files are allowed.");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setFormError("File size must not exceed 10MB.");
                return;
            }
            setAttachment(file);
            setFormError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.leave_type_id) {
            setFormError("Please select a leave type.");
            return;
        }

        if (!formData.start_date || !formData.end_date) {
            setFormError("Please specify start and end dates.");
            return;
        }

        if (new Date(formData.end_date) < new Date(formData.start_date)) {
            setFormError("End date cannot be earlier than start date.");
            return;
        }

        if (formData.duration_type === "HALF_DAY" && formData.start_date !== formData.end_date) {
            setFormError("Half-day leaves must start and end on the same date.");
            return;
        }

        if (!formData.reason.trim() || formData.reason.trim().length < 3) {
            setFormError("Please provide a reason (minimum 3 characters).");
            return;
        }

        if (selectedType?.requires_attachment && !attachment) {
            setFormError(`Attachment is required for ${selectedType.name}.`);
            return;
        }

        try {
            setSubmitting(true);

            const payload = new FormData();
            payload.append("leave_type_id", formData.leave_type_id);
            payload.append("start_date", formData.start_date);
            payload.append("end_date", formData.end_date);
            payload.append("duration_type", formData.duration_type);
            payload.append("reason", formData.reason.trim());

            if (attachment) {
                payload.append("attachment", attachment);
            }

            const res = await leaveApi.applyLeave(payload);

            if (res.success) {
                addToast("Leave request submitted successfully!", "success");
                navigate("/employee/my-leaves");
            }
        } catch (err) {
            console.error("Apply Leave Error:", err);
            setFormError(err.message || "Failed to submit leave request.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: "750px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Top Back Navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                    to="/employee/dashboard"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        color: "var(--gray-500)",
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        fontWeight: 600
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back to Dashboard</span>
                </Link>
            </div>

            <Card
                title="Apply for Leave"
                subtitle="Submit a new time-off application for manager approval"
            >
                {formError && (
                    <div
                        style={{
                            padding: "0.75rem 1rem",
                            backgroundColor: "var(--danger-50)",
                            border: "1px solid var(--danger-100)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--danger-700)",
                            fontSize: "0.8125rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "1.25rem"
                        }}
                    >
                        <AlertCircle size={16} />
                        <span>{formError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Leave Type Select */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                        <Select
                            label="Leave Type"
                            name="leave_type_id"
                            value={formData.leave_type_id}
                            onChange={handleChange}
                            required
                        >
                            {leaveTypes.map((type) => (
                                <option key={type.leave_type_id} value={type.leave_type_id}>
                                    {type.name} ({type.leave_allocation} days / {type.allocation_frequency.toLowerCase()})
                                </option>
                            ))}
                        </Select>

                        <Select
                            label="Duration Type"
                            name="duration_type"
                            value={formData.duration_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="FULL_DAY">Full Day</option>
                            <option value="HALF_DAY">Half Day</option>
                        </Select>
                    </div>

                    {/* Balance Info Banner */}
                    {selectedBalance && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: "var(--primary-50)",
                                border: "1px solid var(--primary-100)",
                                padding: "0.75rem 1rem",
                                borderRadius: "var(--radius-md)",
                                fontSize: "0.8125rem",
                                color: "var(--primary-800)"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Info size={16} />
                                <span>
                                    Remaining Balance: <strong>{selectedBalance.remaining_balance} days</strong> (Allocated: {selectedBalance.allocated_balance}d, Used: {selectedBalance.used_balance}d)
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Dates */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                        <Input
                            label="Start Date"
                            name="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={handleChange}
                            leftIcon={<Calendar size={18} />}
                            required
                        />

                        <Input
                            label="End Date"
                            name="end_date"
                            type="date"
                            value={formData.end_date}
                            min={formData.start_date}
                            disabled={formData.duration_type === "HALF_DAY"}
                            onChange={handleChange}
                            leftIcon={<Calendar size={18} />}
                            required
                        />
                    </div>

                    {/* Duration Summary */}
                    {requestedDays > 0 && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: remainingBalance !== null && requestedDays > remainingBalance ? "var(--danger-600)" : "var(--gray-700)",
                                backgroundColor: remainingBalance !== null && requestedDays > remainingBalance ? "var(--danger-50)" : "var(--gray-50)",
                                padding: "0.625rem 0.875rem",
                                borderRadius: "var(--radius-md)"
                            }}
                        >
                            <Clock size={16} />
                            <span>
                                Total Requested Days: <strong>{requestedDays} {requestedDays === 1 ? "day" : "days"}</strong>
                            </span>
                            {remainingBalance !== null && requestedDays > remainingBalance && (
                                <span style={{ fontSize: "0.75rem", color: "var(--danger-600)", marginLeft: "auto" }}>
                                    Warning: Exceeds your available balance!
                                </span>
                            )}
                        </div>
                    )}

                    {/* Reason */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        <label
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: "var(--gray-700)",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem"
                            }}
                        >
                            Reason for Leave <span style={{ color: "var(--danger-600)" }}>*</span>
                        </label>
                        <textarea
                            name="reason"
                            rows={3}
                            placeholder="Explain the purpose of your leave request..."
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                padding: "0.625rem 0.875rem",
                                fontSize: "0.875rem",
                                fontFamily: "var(--font-body)",
                                color: "var(--gray-900)",
                                border: "1px solid var(--gray-300)",
                                borderRadius: "var(--radius-md)",
                                outline: "none",
                                resize: "vertical",
                                minHeight: "80px"
                            }}
                        />
                    </div>

                    {/* Attachment Upload */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        <label
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: "var(--gray-700)",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem"
                            }}
                        >
                            Attachment {selectedType?.requires_attachment && <span style={{ color: "var(--danger-600)" }}>* (Required)</span>}
                        </label>

                        {!attachment ? (
                            <label
                                style={{
                                    border: "2px dashed var(--gray-300)",
                                    borderRadius: "var(--radius-md)",
                                    padding: "1.5rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    backgroundColor: "var(--gray-50)",
                                    transition: "border-color 0.15s ease"
                                }}
                            >
                                <Upload size={24} style={{ color: "var(--gray-400)", marginBottom: "0.5rem" }} />
                                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary-600)" }}>
                                    Click to upload a document
                                </span>
                                <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem" }}>
                                    Supported: PDF, PNG, JPG (up to 10MB)
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "0.75rem 1rem",
                                    backgroundColor: "var(--gray-50)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-md)"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <FileText size={18} style={{ color: "var(--primary-600)" }} />
                                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-800)" }}>
                                        {attachment.name}
                                    </span>
                                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>
                                        ({(attachment.size / (1024 * 1024)).toFixed(2)} MB)
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAttachment(null)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "var(--gray-400)"
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/employee/dashboard")}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            loading={submitting}
                            leftIcon={<CalendarPlus size={18} />}
                        >
                            Submit Leave Request
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
