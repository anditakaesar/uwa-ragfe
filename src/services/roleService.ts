import { axiosClient } from "../api/axiosClient";
import type { ApiResponse, ApiResponseWithMeta } from "../api/types";
import type { GetRolesRequest, GetRolesResponseMeta, Role } from "../types/role";

export const roleService = {
    getRoles: async (params?: GetRolesRequest): Promise<ApiResponseWithMeta<Role[], GetRolesResponseMeta>> => {
        const response = await axiosClient.get<ApiResponseWithMeta<Role[], GetRolesResponseMeta>>('/roles', {
            params: {
                name: params?.name || undefined,
                page: params?.page,
                size: params?.size,
            }
        })
        return response.data
    },

    getRole: async (id: number): Promise<ApiResponse<Role>> => {
        const url = `/role/${id}`
        const response = await axiosClient.get<ApiResponse<Role>>(url)
        return response.data
    }
}