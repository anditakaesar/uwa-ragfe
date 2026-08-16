import { apiChatClient } from "../api/axiosClient"
import type { ApiResponse } from "../api/types"
import type { ChatResponse } from "../types/chat"

export const chatService = {
  sendPrompt: async (prompt: string): Promise<ApiResponse<ChatResponse>> => {
    const response = await apiChatClient.post<ApiResponse<ChatResponse>>('/chat/raw', {
      prompt: prompt
    })

    return response.data
  }
}