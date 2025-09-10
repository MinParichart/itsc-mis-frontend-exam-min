// src/models/blog.ts
// NEW: UI model + mapper จาก ApiBlog

import type { ApiBlog } from "./api";

export interface Blog {
  id: number;
  title: string;
  date: string;
  thumbnail?: string;
  active: boolean;
  content?: string;
  pin: boolean;
  createdMs: number;
}

// NOTE: origin สำหรับต่อ path ภาพ (ตามรูปแบบโปรเจ็กต์เดิมคุณ)
const API_BASE =
  (import.meta.env.VITE_API_BASE as string) || "https://exam-api.dev.mis.cmu.ac.th/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

function toThaiDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const date = d.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${date} ${time} น.`;
}

function fixImgUrl(u?: string): string | undefined {
  if (!u) return undefined;
  const clean = u.replace(/\\/g, "/").replace(/^\/+/, "/");
  if (/^https?:\/\//i.test(clean)) return clean;
  const origin = API_ORIGIN.replace(/\/+$/, "");
  return `${origin}${clean.startsWith("/") ? "" : "/"}${clean}`;
}

export function mapApiBlog(b: ApiBlog): Blog {
  return {
    id: Number(b.id),
    title: String(b.title ?? ""),
    date: toThaiDate(b.createdAt),
    thumbnail: fixImgUrl(b.img?.url ?? b.Img?.url),
    active: Boolean(b.active),
    content: typeof b.content === "string" ? b.content : "",
    pin: Boolean(b.pin),
    createdMs: b.createdAt ? new Date(b.createdAt).getTime() : 0,
  };
}
