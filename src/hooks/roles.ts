import { useQuery } from "@tanstack/react-query";
import type { GetRolesRequest } from "../types/role";
import { roleService } from "../services/roleService";
import type { DropdownItem } from "../types/dropdownItem";

export const useRoles = (params: GetRolesRequest) => {
    return useQuery({
        queryKey: ['roles', params],
        queryFn: () => roleService.getRoles(params),
        staleTime: 1_000 * 60 * 60,
    })
}

export const useRolesLookup = (params: GetRolesRequest) => {
    return useQuery({
        queryKey: ['roles', params],
        queryFn: () => roleService.getRoles(params),
        staleTime: 1_000 * 60 * 60,
        select: (data) => {
            const map : DropdownItem[] = []

            data.data.forEach((role) => {
                map.push({
                    id: `${role.id}`,
                    label: role.name
                })
            })

            return { map }
        }
    })
}

export const useRole = (id: number) => {
    return useQuery({
        queryKey: ['roles', id],
        queryFn: () => roleService.getRole(id),
        enabled: Boolean(id)
    })
}