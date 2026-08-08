import type { AxiosProgressEvent, AxiosResponse } from "axios"
import { axiosClient, apiClientS3 } from "../api/axiosClient"
import type { ApiResponse, ApiResponseWithMeta } from "../api/types"
import type { File as Doc, GetFilesRequest, GetFilesResponseMeta, PresignedURLResponse } from "../types/file"
import axios, { HttpStatusCode } from "axios"

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
      params: {
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

  uploadFile: async (param: UploadFileRequest) : Promise<AxiosResponse<void>> => {
    const response = await axios.put(param.PresignURL, param.ContentFile, {
      headers: {
        'Content-Type': param.ContentFile.type || 'application/octet-stream',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent): void => {
        if (param.onProgress && progressEvent.total) {
          const precentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          param.onProgress(precentCompleted)
        }
      }
    })
    return response
  },

  updateStatus: async (fileID: string, status: 'completed' | 'failed'): Promise<AxiosResponse<void>> => {
    const response = await axiosClient.patch(`/files/${fileID}/status`, {
      status: status
    })

    return response
  }
}