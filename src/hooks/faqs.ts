import { useQuery } from "@tanstack/react-query"
import type { GetFAQRequest } from "../types/faq"
import { faqService } from "../services/faqService"

export const useFAQs = (params: GetFAQRequest) => {
  return useQuery({
    queryKey: ['faqs', params],
    queryFn: () => faqService.getFAQs(params)
  })
}