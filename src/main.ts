// main.ts
import './style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// CHANGE 1: ใช้ Axios + type error
import Axios, { AxiosError } from 'axios'

// CHANGE 2: Augment type เพื่อให้ config._retry ไม่ฟ้อง TS
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
  }
}

// CHANGE 3: ตั้งค่า baseURL/headers เริ่มต้น
Axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE || 'https://exam-api.dev.mis.cmu.ac.th/api'
Axios.defaults.headers.common['Accept'] = 'application/json'

// CHANGE 4: request interceptor — แนบ Bearer token ถ้ามี
Axios.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  if (t) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${t}` }
  }
  return config
})

// CHANGE 5: response interceptor — refresh token เมื่อเจอ 401
let refreshing = false
let waiters: Array<(token: string) => void> = []

Axios.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status
    const original = error.config

    // ไม่ใช่ 401 หรือไม่มีต้นฉบับรีเควสต์ → โยนต่อ
    if (!original || status !== 401) {
      return Promise.reject(error)
    }

    // ข้าม refresh สำหรับ endpoint auth เอง (กันวน/กันซ้ำซ้อน)
    const url = original.url || ''
    if (/\/auth\/(login|refresh|logout)$/.test(url)) {
      return Promise.reject(error)
    }

    // กันวนลูป
    if (original._retry) {
      return Promise.reject(error)
    }
    original._retry = true

    // ถ้ามีการ refresh อยู่แล้ว → เข้าคิวรอ
    if (refreshing) {
      return new Promise((resolve) => {
        waiters.push((newToken: string) => {
          original.headers = {
            ...(original.headers || {}),
            Authorization: `Bearer ${newToken}`,
          }
          resolve(Axios(original))
        })
      })
    }

    // เริ่ม refresh จริง
    refreshing = true
    try {
      const rt = localStorage.getItem('refresh_token')
      if (!rt) throw new Error('missing refresh token')

      const { data } = await Axios.post<{
        access_token: string
        expires_in: number
      }>('/auth/refresh', { refresh_token: rt })

      const newToken = data.access_token
      localStorage.setItem('token', newToken)
      localStorage.setItem(
        'token_exp',
        String(Date.now() + data.expires_in * 1000)
      )

      // ปลดล็อกคิวด้วย token ใหม่
      waiters.forEach((cb) => cb(newToken))
      waiters = []
      refreshing = false

      // ยิงคำขอเดิมซ้ำด้วย token ใหม่
      original.headers = {
        ...(original.headers || {}),
        Authorization: `Bearer ${newToken}`,
      }
      return Axios(original)
    } catch (e) {
      // refresh พัง → เคลียร์ข้อมูลและเด้งไป /login
      refreshing = false
      waiters = []
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('token_exp')
      if (location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(e)
    }
  }
)

createApp(App).use(router).mount('#app')
