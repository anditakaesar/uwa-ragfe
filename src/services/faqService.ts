import { axiosClient } from "../api/axiosClient"
import type { ApiResponse, ApiResponseWithMeta } from "../api/types"
import type { FAQ, GetFAQRequest, GetFAQResponseMeta, UpdateFAQParam } from "../types/faq"

export const faqService = {
  getFAQs: async (params?: GetFAQRequest): Promise<ApiResponseWithMeta<FAQ[], GetFAQResponseMeta>> => {
      const response = await axiosClient.get<ApiResponseWithMeta<FAQ[], GetFAQResponseMeta>>('/faqs', {
        params: {
          page: params?.page,
          size: params?.size,
        }
      })
      return response.data
    },
  answerFAQ: async (id: string, answer: string): Promise<ApiResponse<FAQ>> => {
    const response = await axiosClient.put<ApiResponse<FAQ>>(`/faqs/${id}/answer`, {
      answer,
    })

    return response.data
  },
  deleteFAQ: async (id: string): Promise<ApiResponse<string>> => {
    const response = await axiosClient.delete<ApiResponse<string>>(`/faqs/${id}`)

    return response.data
  },
  updateFAQ: async (param: UpdateFAQParam): Promise<ApiResponse<FAQ>> => {
    const response = await axiosClient.patch<ApiResponse<FAQ>>(`/faqs/${param.id}`, {
      status: param.status,
    })

    return response.data
  }
}