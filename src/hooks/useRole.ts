import { useQuery } from "@tanstack/react-query"
import { roleService } from "../services/roleService"

export const useRole = (id: number) => {
    return useQuery({
        queryKey: ['roles', id],
        queryFn: () => roleService.getRole(id),
        enabled: Boolean(id)
    })
}