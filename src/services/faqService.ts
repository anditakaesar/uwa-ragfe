import { axiosClient } from "../api/axiosClient"
import type { ApiResponseWithMeta } from "../api/types"
import type { FAQ, GetFAQRequest, GetFAQResponseMeta } from "../types/faq"

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
}