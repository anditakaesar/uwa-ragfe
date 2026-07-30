import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userService } from "../services/userService"
import type { CreateUserRequest, GetUsersRequest } from "../types/user"

export const useUsers = (params: GetUsersRequest) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params)
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.newUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users']})
    },
  })
}