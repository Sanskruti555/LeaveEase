import * as auditLogRepository from "./auditLog.repository.js";

export const createAuditLog = async (data) => {

    try {

        const logId =
            await auditLogRepository.createAuditLog(data);

        return {
            success: true,
            data: {
                log_id: logId
            }
        };

    } catch (error) {

        console.error(
            "Create Audit Log Error:",
            error
        );

        return {
            success: false,
            message: "Failed to create audit log."
        };
    }
};