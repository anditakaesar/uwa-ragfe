import type { PaginationMeta } from "../api/types"

export interface FAQ {
  id: string
  question: string
  status: string
  answer: string
  createdAt: string
}

export interface GetFAQRequest {
  page?: number
  size?: number
}

export interface GetFAQResponseMeta {
  pagination: PaginationMeta
}