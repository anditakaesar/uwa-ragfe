import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { profileService } from "../services/profileService";

export function useProfile() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: profileService.getProfile,
    enabled: isAuthenticated,
  })
}
