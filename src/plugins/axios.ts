// src/plugins/axios.ts
import router from "@/router";
import Axios from "axios";

// baseURL ของทุกคำขอ
const API_BASE =
  (import.meta.env.VITE_API_BASE as string) ||
  "https://exam-api.dev.mis.cmu.ac.th/api";

Axios.defaults.baseURL = API_BASE;

// ---- helper: เก็บ token ลง localStorage ----
type LoginResp = { access_token: string; refresh_token: string; expires_in: number };

function saveTokens(data: LoginResp) {
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  localStorage.setItem("token_exp", String(Date.now() + data.expires_in * 1000));
}

// ---- Request interceptor: ใส่ Authorization ทุกครั้ง (บังคับ override) ----
Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (!config.headers) config.headers = {};
  if (token) {
    // บังคับใส่ token ล่าสุดเสมอ (ทับของเดิมถ้ามี)
    (config.headers as any).Authorization = `Bearer ${token}`;
  } else {
    delete (config.headers as any).Authorization;
  }
  return config;
});

// ---- Response interceptor: ถ้า 401 ให้พยายาม refresh แล้ว “ลองใหม่ 1 ครั้ง” ----
let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshing) {
    const rt = localStorage.getItem("refresh_token") || "";
    refreshing = Axios.post<LoginResp>("/auth/refresh", { refresh_token: rt })
      .then(({ data }) => {
        saveTokens(data);
        return data.access_token;
      })
      .finally(() => (refreshing = null));
  }
  return refreshing;
}

Axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    const status = response?.status as number | undefined;

    // ไม่พยายาม refresh สำหรับ endpoint login/refresh เอง
    const url = (config?.url || "").toString();
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && !isAuthEndpoint && !config._retry) {
      config._retry = true; // กันวนซ้ำ
      try {
        const newToken = await refreshAccessToken();
        if (!config.headers) config.headers = {};
        (config.headers as any).Authorization = `Bearer ${newToken}`;
        return Axios(config); // ยิงคำขอเดิมอีกครั้ง
      } catch {
        // refresh ล้มเหลว → ล้าง token แล้วพาไปหน้า login
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_exp");
        router.push({ path: "/login", query: { redirect: router.currentRoute.value.fullPath } });
      }
    }
    return Promise.reject(error);
  }
);
