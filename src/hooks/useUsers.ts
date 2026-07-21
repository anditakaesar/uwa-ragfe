import { useQuery } from "@tanstack/react-query"
import { userService } from "../services/userService"
import type { GetUsersRequest } from "../types/user"

export const useUsers = (params: GetUsersRequest) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params)
  })
}
