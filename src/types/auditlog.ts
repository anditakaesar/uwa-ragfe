import type { PaginationMeta } from "../api/types"

export interface AuditLog {
    id: number
    resourceName: string
    resourceID: string
    actorID: number | null
    actorName: string
    actorType: string
    action: string
    createdAt: string
}

export interface GetAuditLogRequest {
    resourceName?: string
    page?: number
    size?: number
}

export interface GetAuditLogResponseMeta {
    resourceNameLike: string | null
    pagination: PaginationMeta
}