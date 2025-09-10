// src/stores/auth.ts
// NEW: pinia store สำหรับชื่อผู้ใช้ + me/logout

import { defineStore } from "pinia";
import { me as apiMe, logout as apiLogout, login as apiLogin } from "@/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    username: (localStorage.getItem("username") as string | null) || null,
  }),
  actions: {
    async fetchMe() {
      try {
        const { username } = await apiMe();
        this.username = username ?? null;
      } catch {
        this.username = null;
      }
    },
    async logout() {
      await apiLogout();
      this.username = null;
    },
    async login(u: string, p: string) {
      await apiLogin(u, p);
      await this.fetchMe();
    },
  },
});
