import { axiosClient } from "../api/axiosClient";
import type { ApiResponse, ApiResponseWithMeta } from "../api/types";
import type { CreateUserRequest, GetUsersRequest, GetUsersResponseMeta, User } from "../types/user";

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

  newUser: async (params: CreateUserRequest): Promise<ApiResponse<User>> => {
    const response = await axiosClient.post<ApiResponse<User>>('/users', params)

    return response.data
  },
}
