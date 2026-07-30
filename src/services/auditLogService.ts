import { axiosClient } from "../api/axiosClient";
import type { ApiResponseWithMeta } from "../api/types";
import { type AuditLog, type GetAuditLogRequest, type GetAuditLogResponseMeta } from "../types/auditlog";

export const auditLogService = {
    getAuditLogs: async (params?: GetAuditLogRequest): Promise<ApiResponseWithMeta<AuditLog[], GetAuditLogResponseMeta>> => {
        const response = await axiosClient.get<ApiResponseWithMeta<AuditLog[], GetAuditLogResponseMeta>>('/auditlogs', {
            params: {
                resourcename: params?.resourceName || undefined,
                page: params?.page,
                size: params?.size,
            }
        })
        return response.data
    }
}