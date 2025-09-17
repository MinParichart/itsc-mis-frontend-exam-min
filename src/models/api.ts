// src/models/api.ts
export type ApiImage = { url?: string }

export interface ApiBlog {
  id: number | string
  title?: string
  content?: string
  hit?: number
  pin?: boolean
  active?: boolean
  createdAt?: string
  updatedAt?: string
  img?: ApiImage
  Img?: ApiImage
}

export interface ApiList<T> {
  totalItems: number
  rows: T[]
  totalPages: number
  currentPage: number
}

// REST endpoints
export const API_BASE: string = (import.meta.env.VITE_API_BASE as string) || 'https://exam-api.dev.mis.cmu.ac.th/api'
export const BLOGS_INDEX = '/blogs'
export const BLOG_BY_ID = (id: number | string) => `/blogs/${id}`
export const BLOG_REMOVE_IMAGE = (id: number | string) => `/blogs/${id}/remove-image`
export const BLOG_DELETE_MANY = '/blogs/delete'
