import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '@carbon/react'

export default function LoginPage() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errmessage, setErrmessage] = useState<string>('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => { // Changed type to standard React.FormEvent
    e.preventDefault()
    setErrmessage('')

    const requestbody = {
      username: username,
      password: password
    }

    try {
      const response = await axios({
        method: 'post',
        baseURL: 'https://localhost:3000/api',
        url: `/auth/login`,
        headers: { 'Content-Type': 'application/json' },
        data: requestbody,
        withCredentials: true,
      })

      const { token } = response.data.data
      login(token)

      // Move to dashboard immediately
      navigate('/dashboard', { replace: true })

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { data } = error.response
          setErrmessage(data.error?.message || 'Authentication failed')
        } else {
          console.error('Network error or no response')
        }
      } else {
        const err = error as Error
        console.error('Standard error:', err.message)
      }
    }
  }

  return (
    <>
      <section id="center">
        <div>
          <h1>Login Here</h1>
          <form onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="username">Username: </label>
              <input id="username"
                name="username"
                type="text"
                value={username}
                onChange={
                  (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}></input>
            </div>
            <div>
              <label htmlFor="password">Password: </label>
              <input id="password"
                name="password"
                type="password"
                value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}></input>
            </div>
            <Button type="submit" onClick={() => { }}>
              Login
            </Button>
          </form>
        </div>
        <div>
          Err msg: {errmessage}
        </div>
      </section>
    </>
  )
}
