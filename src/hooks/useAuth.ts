import { useContext } from "react"
import { AuthContext } from "../context/AuthContextSetup"

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within and AuthProvider")
  return context
}
