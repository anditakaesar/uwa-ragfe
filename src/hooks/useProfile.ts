import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { profileService, type UserProfile } from "../services/profileService";

export function useProfile() {
  const { isAuthenticated } = useAuth()

  return useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: profileService.getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // Cache stays fresh for 5 minutes
    retry: false,
  })
}
