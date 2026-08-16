import type { AxiosResponse } from "axios"
import { axiosClient } from "../api/axiosClient"
import type { ApiResponse, ApiResponseWithMeta } from "../api/types"
import type { File as Doc, GetFilesRequest, GetFilesResponseMeta, PresignedURLResponse } from "../types/file"

export interface PresignedURLParam {
	Name:      string
	SizeBytes: number
	MimeType:  string
}

export interface UploadProgressCallback {
  (percentage: number): void
}

export interface UploadFileRequest {
  PresignURL: string, 
  ContentFile: File | Blob,
  onProgress?: UploadProgressCallback
}

export const fileService = {
  createPresignedURL: async (param: PresignedURLParam): Promise<ApiResponse<PresignedURLResponse>> => {
    const response = await axiosClient.post('/files/generate-presign-url', param)

    return response.data
  },

  getFiles: async (params?: GetFilesRequest): Promise<ApiResponseWithMeta<Doc[], GetFilesResponseMeta>> => {
    const response = await axiosClient.get<ApiResponseWithMeta<Doc[], GetFilesResponseMeta>>('/files', {
      paramsSerializer: {
        indexes: null
      },
      params: {
        mimeTypes: params?.mimeTypes,
        page: params?.page,
        size: params?.size,
      }
    })
    return response.data
  },

  getDownloadLink: async (fileID: string): Promise<ApiResponse<string>> => {
    const response = await axiosClient.get<ApiResponse<string>>(`/files/${fileID}/download`)
    return response.data
  },

  generateThumbnail: async (fileID: string): Promise<ApiResponse<string>> => {
    const response = await axiosClient.post<ApiResponse<string>>(`/files/${fileID}/enqueue-thumbnail`)

    return response.data
  },

  updateStatus: async (fileID: string, status: 'completed' | 'failed'): Promise<AxiosResponse<void>> => {
    const response = await axiosClient.patch(`/files/${fileID}/status`, {
      status: status
    })

    return response
  },

  deleteFile: async (fileID: string): Promise<ApiResponse<string>> => {
    const response = await axiosClient.delete<ApiResponse<string>>(`/files/${fileID}`)

    return response.data
  },

  processEmbedding: async (fileID: string): Promise<ApiResponse<string>> => {
    const response = await axiosClient.post<ApiResponse<string>>(`/files/${fileID}/enqueue-rag-ingestion`)

    return response.data
  }
}