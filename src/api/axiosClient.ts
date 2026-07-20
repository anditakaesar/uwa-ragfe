import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

export const axiosClient = axios.create({
  baseURL: 'https://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

// attach access token
axiosClient.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/auth/refresh')) {
      return config
    }

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (originalRequest.url?.includes('/auth/refresh')) {
      localStorage.removeItem('token')
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(axiosClient(originalRequest))
          },
          reject: (err) => {
            reject(err)
          },
        })
      })
    }

    isRefreshing = true

    try {
      const response = await axiosClient.post('/auth/refresh')
      const newToken = response.data.data.token

      localStorage.setItem('token', newToken)

      processQueue(null, newToken)
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return axiosClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      localStorage.removeItem('token')

      // only redirect if regular api call failed
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
