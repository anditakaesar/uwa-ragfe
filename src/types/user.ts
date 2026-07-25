import type { PaginationMeta } from "../api/types"

export interface User {
  id: number
  username: string
  roleID: number
  createdAt: string
  roleName: string
}

export interface GetUsersRequest {
  username?: string
  page?: number
  size?: number
}

export interface GetUsersResponseMeta {
  usernamelike: string | null
  pagination: PaginationMeta
}
