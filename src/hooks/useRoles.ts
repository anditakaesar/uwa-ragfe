import { useQuery } from "@tanstack/react-query";
import type { GetRolesRequest } from "../types/role";
import { roleService } from "../services/roleService";

export interface RoleSelectOption {
    value: string
    description: string
}

export const useRoles = (params: GetRolesRequest) => {
    return useQuery({
        queryKey: ['roles', params],
        queryFn: () => roleService.getRoles(params),
        staleTime: 1_000 * 60 * 60,
    })
}