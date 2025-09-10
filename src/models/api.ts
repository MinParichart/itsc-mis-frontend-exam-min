// src/models/blog.ts
import dayjs from "@/plugins/dayjs";

export type ApiImage = { url?: string };

export interface ApiBlog {
  id: number | string;
  title?: string;
  content?: string;
  hit?: number;
  pin?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  img?: ApiImage;
  Img?: ApiImage;
}

export interface Blog {
  id: number;
  title: string;
  date: string;        // แสดงผลพร้อมเวลา (ไทย)
  thumbnail?: string;
  active: boolean;
  content: string;
  pin: boolean;
  createdMs: number;
}

export interface ApiListResp {
  totalItems: number;
  rows: ApiBlog[];
  totalPages: number;
  currentPage: number;
}
export interface ApiAltResp {
  data: ApiBlog[];
}

const API_ORIGIN = ((import.meta.env.VITE_API_BASE as string) || "https://exam-api.dev.mis.cmu.ac.th/api")
  .replace(/\/api\/?$/, "");

export function fixImgUrl(u?: string): string | undefined {
  if (!u) return undefined;
  const clean = u.replace(/\\/g, "/").replace(/^\/+/, "/");
  if (/^https?:\/\//i.test(clean)) return clean;
  const origin = API_ORIGIN.replace(/\/+$/, "");
  return `${origin}${clean.startsWith("/") ? "" : "/"}${clean}`;
}

export function toThaiDate(iso?: string): string {
  if (!iso) return "";
  return dayjs(iso).format("DD MMM YYYY HH:mm") + " น.";
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
