import { axiosClient } from "../api/axiosClient"
import type { ApiResponse } from "../api/types"

export interface UserProfile {
  id: number
  username: string
}

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosClient.get<ApiResponse<UserProfile>>('/users/me')
    return response.data.data
  },

  // other interfaces here such as updateProfile()
}
