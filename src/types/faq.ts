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

export interface UpdateFAQParam {
  id: string
  status: string
}