import type { GetFilesRequest } from "../types/file"
import { fileService, type UploadProgressCallback } from "../services/fileService"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { HttpStatusCode, type AxiosProgressEvent } from "axios"
import { axiosClient } from "../api/axiosClient"

export interface UploadFileParam {
  file: File
  onProgress?: UploadProgressCallback
}

export const useFiles = (params: GetFilesRequest) => {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => fileService.getFiles(params)
  })
}

export const useUploadFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, onProgress }: UploadFileParam) => {
      const responseGen = await fileService.createPresignedURL({
        Name: file.name,
        MimeType: file.type,
        SizeBytes: file.size,
      })

      const responseUpl = await axios({
        method: 'PUT',
        url: responseGen.data.presignURL,
        data: file,
        headers: { 'Content-Type': file.type },
        timeout: 0,
        responseType: 'text',
        onUploadProgress: (progressEvent: AxiosProgressEvent): void => {
          if (onProgress && progressEvent.total) {
            const precentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            onProgress(precentCompleted)
          }
        },
      })

      const respStatus = responseUpl.status === HttpStatusCode.Ok ? 'completed' : 'failed'
      const uploadRes = await axiosClient.patch(`/files/${responseGen.data.fileID}/status`, {
        status: respStatus
      })

      return uploadRes.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
    }
  })
}