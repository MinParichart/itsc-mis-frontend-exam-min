// src/plugins/axios.ts
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'

const API_BASE =
  (import.meta.env.VITE_API_BASE as string) ||
  'https://exam-api.dev.mis.cmu.ac.th/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }
  return config
})

let refreshing = false
let refreshPromise: Promise<string | null> | null = null

async function doRefresh(): Promise<string | null> {
  const refresh_token = localStorage.getItem('refresh_token')
  if (!refresh_token) return null
  try {
    const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token })
    const access = data?.access_token as string | undefined
    if (access) {
      localStorage.setItem('token', access)
      return access
    }
    return null
  } catch {
    return null
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError | any) => {
    const status = error?.response?.status
    const original = (error?.config || {}) as AxiosRequestConfig & { __isRetry?: boolean }

    if (status === 401 && !original.__isRetry) {
      if (!refreshing) {
        refreshing = true
        refreshPromise = doRefresh().finally(() => { refreshing = false })
      }
      const newToken = await refreshPromise
      if (newToken) {
        original.__isRetry = true
        original.headers = original.headers || {}
        ;(original.headers as any).Authorization = `Bearer ${newToken}`
        return api(original)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
      }
    }

    return Promise.reject(error)
  }
)

export default api
export { api }
