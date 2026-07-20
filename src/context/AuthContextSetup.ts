import { createContext } from "react";

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (token: string) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
