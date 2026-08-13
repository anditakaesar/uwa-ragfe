import type { PaginationMeta } from "../api/types"

export interface File {
  id: string
  userID: number
  originalName: string
  mimeType: string
  sizeBytes: number
  sizeHumanize: string
  thumbnailURL: string
  status: string
  createdAt: string
}

export interface GetFilesRequest {
  mimeTypes?: string[],
  page?: number
  size?: number
}

export interface GetFilesResponseMeta {
  pagination: PaginationMeta
}

export interface PresignedURLResponse {
  fileID:     string
  presignURL: string
}