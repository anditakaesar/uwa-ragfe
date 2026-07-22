import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button, Callout, Content, FlexGrid, Form, Heading, Row, TextInput, Tile, ToastNotification } from '@carbon/react'
import './Login.scss'

export default function LoginPage() {
  const [username, setUsername] = useState<string>('admin')
  const [password, setPassword] = useState<string>('admin12345')
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
    <Content className='login-container'>
      <Form onSubmit={handleSubmit}>
        <FlexGrid className='login-content' fullWidth>
          <Row>
            <Heading>Welcome</Heading>
          </Row>
          <Row>
            <TextInput id='username'
                labelText='username'
                name='username'
                type='text'
                value={username}
                onChange={
                  (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}></TextInput>
          </Row>
          <Row>
            <TextInput id='password'
              labelText='password'
              name='password'
              type='password'
              value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}></TextInput>
          </Row>
          <Row>
            <Button type='submit' onClick={() => {
              setErrmessage('')
            }}>
              Login
            </Button>
          </Row>
          <Row className={ !errmessage ? 'hidden': ''}>
            <Callout 
              aria-label='error login notification'
              kind='error'
              role='status'
              title='Error Login'
              subtitle={errmessage}
            />
          </Row>
        </FlexGrid>
      </Form>

    </Content>
  )
}
