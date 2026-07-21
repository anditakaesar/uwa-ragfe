import { axiosClient } from "../api/axiosClient";
import type { ApiResponseWithMeta } from "../api/types";
import type { GetUsersRequest, GetUsersResponseMeta, User } from "../types/user";

export const userService = {
  getUsers: async (params?: GetUsersRequest): Promise<ApiResponseWithMeta<User[], GetUsersResponseMeta>> => {
    const response = await axiosClient.get<ApiResponseWithMeta<User[], GetUsersResponseMeta>>('/users', {
      params: {
        username: params?.username || undefined,
        page: params?.page,
        size: params?.size,
      }
    })
    return response.data
  },

  // other interfaces here such as updateUser()
}
