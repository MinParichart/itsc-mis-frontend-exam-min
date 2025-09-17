// src/models/common.ts
export interface ApiErrorPayload {
  message?: string
  error?: string
  errors?: Record<string, unknown>
}
