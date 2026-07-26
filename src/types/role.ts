import type { PaginationMeta } from "../api/types"

export interface Role {
  id: number
  name: string
  idName: string
}

export interface GetRolesRequest {
  name?: string
  page?: number
  size?: number
}

export interface GetRolesResponseMeta {
  namelike: string | null
  pagination: PaginationMeta
}