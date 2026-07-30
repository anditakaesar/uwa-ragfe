import { useQuery } from "@tanstack/react-query";
import type { GetAuditLogRequest } from "../types/auditlog";
import { auditLogService } from "../services/auditLogService";

export const useAuditLogs = (params: GetAuditLogRequest) => {
    return useQuery({
        queryKey: ['auditlogs', params],
        queryFn: () => auditLogService.getAuditLogs(params)
    })
}