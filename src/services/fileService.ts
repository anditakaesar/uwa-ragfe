import { axiosClient } from "../api/axiosClient"
import type { ApiResponse } from "../api/types"

export interface PresignedURLParam {
    fileName: string
}

export interface PresignedURLResponse {
    url: string
}

export const fileService = {
    createPresignedURL: async (param: PresignedURLParam): Promise<ApiResponse<PresignedURLResponse>> => {
        const response = await axiosClient.post('/upload/presignedurl', param)

        return response.data
    }
}