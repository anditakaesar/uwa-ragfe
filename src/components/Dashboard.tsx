import { useState } from "react"
import { useAuth } from "../hooks/useAuth"

function Dashboard() {
  const { token, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)

    try {
      await logout()
    } catch (err) {
      console.error("Failed to cleanly logout:", err)
      setLoggingOut(false)
    }
  }

  return (
    <>
      <div>This is your dashboard. Token: {token ? `${token.substring(0, 12)}...` : 'None'}</div>
      <button type="button" onClick={handleLogout} disabled={loggingOut}>
        {loggingOut ? 'Signing Out...' : 'Sign Out'}
      </button>
    </>
  )
}

export default Dashboard
