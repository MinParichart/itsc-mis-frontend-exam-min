// src/models/blog.ts
import dayjs from '@/plugins/dayjs'
import type { ApiBlog } from './api'

export interface Blog {
  id: number
  title: string
  content?: string
  active: boolean
  pin: boolean
  date: string
  thumbnail?: string
  createdMs: number
  hit?: number
}

export interface BlogQuery {
  page?: number
  size?: number
  q?: string
  show?: 'all' | 'active'
}

export interface BlogCreateInput {
  title: string
  content: string
  file?: File | null
}

export interface BlogUpdateInput {
  title?: string
  content?: string
  pin?: boolean
  active?: boolean
  file?: File | null
}

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'https://exam-api.dev.mis.cmu.ac.th/api'
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE).origin
  } catch {
    return API_BASE.replace(/\/api\/?$/, '')
  }
})()

export function fixImgUrl(rel?: string): string | undefined {
  if (!rel) return undefined
  let clean = String(rel).replace(/\\/g, '/').trim() // \ -> /

  // เป็น absolute แล้วก็ใช้ได้เลย
  if (/^https?:\/\//i.test(clean)) return clean

  // กันกรณีไม่มี / นำหน้า
  if (!clean.startsWith('/')) clean = '/' + clean

  return API_ORIGIN.replace(/\/$/, '') + clean
}

export function toThaiDate(iso?: string): string {
  if (!iso) return ''
  return dayjs(iso).format('D MMM YYYY HH:mm น.')
}

export function mapApiBlog(b: ApiBlog): Blog {
  const rawUrl =
    (b as any)?.Img?.url ??
    (b as any)?.img?.url ??
    (b as any)?.image?.url

  return {
    id: Number(b.id),
    title: String(b.title ?? ''),
    content: typeof b.content === 'string' ? b.content : '',
    active: Boolean(b.active),
    pin: Boolean(b.pin),
    date: toThaiDate(b.createdAt),
    thumbnail: fixImgUrl(typeof rawUrl === 'string' ? rawUrl : undefined),
    createdMs: b.createdAt ? new Date(b.createdAt).getTime() : 0,
    hit: typeof b.hit === 'number' ? b.hit : undefined,
  }
}
