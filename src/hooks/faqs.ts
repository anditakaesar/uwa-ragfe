import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { GetFAQRequest, UpdateFAQParam } from "../types/faq"
import { faqService } from "../services/faqService"

export const useFAQs = (params: GetFAQRequest) => {
  return useQuery({
    queryKey: ['faqs', params],
    queryFn: () => faqService.getFAQs(params)
  })
}

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const responseDel = await faqService.deleteFAQ(id)

      return responseDel.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['faqs']})
    }
  })
}

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (param: UpdateFAQParam) => faqService.updateFAQ(param),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['faqs']})
    }
  })
}

export const useAnswerFAQ = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, answer} : {id: string, answer: string}) => {
      const response = await faqService.answerFAQ(id, answer)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['faqs']})
    },
  })
}