// src/services/authService.ts
// NEW: รวม API auth (login/me/logout)

import api, { plain } from "@/plugins/axios";
import type { LoginResp } from "@/models/api";

export async function login(username: string, password: string) {
  const { data } = await plain.post<LoginResp>("/auth/login", { username, password });
  // เก็บ token ไว้ที่ localStorage ตามรูปแบบเดิม (ให้ axios.ts ใช้)
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  localStorage.setItem("token_exp", String(Date.now() + data.expires_in * 1000));
  return data;
}

export async function me(): Promise<{ username?: string }> {
  const { data } = await api.get("/auth/me");
  // เก็บชื่อไว้ใช้ navbar
  const uname = data?.username ?? undefined;
  if (uname) localStorage.setItem("username", uname);
  return { username: uname };
}

export async function logout() {
  try {
    await api.delete("/auth/logout");
  } catch {
    // เงียบๆ
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_exp");
    localStorage.removeItem("username");
  }
}
