// src/models/blog.ts
import dayjs from "@/plugins/dayjs"; // ใช้ library dayjs (ผ่าน plugin) สำหรับจัดการวันเวลา
import type { ApiBlog } from "./api"; // นำ type ของ ApiBlog ที่ได้จาก API มาใช้

// ---------- โครงสร้างข้อมูลฝั่ง Frontend ----------

// Blog → ใช้ภายในแอป (หลังจาก map จาก ApiBlog)
export interface Blog {
  id: number; // id ของ blog (เลขเสมอ เพราะถูกแปลงจาก string → number แล้ว)
  title: string; // หัวข้อบทความ
  content?: string; // เนื้อหาบทความ
  active: boolean; // true = เผยแพร่ / false = ซ่อน
  pin: boolean; // true = ปักหมุด
  date: string; // วันที่ (เป็น string ที่ format เรียบร้อยแล้ว → ใช้ใน UI)
  thumbnail?: string; // URL ของรูป (แก้ path มาแล้ว)
  createdMs: number; // เวลาเป็น millisecond → ใช้สำหรับ sort ได้ง่าย
  hit?: number; // จำนวนวิว (อาจจะไม่มี)
}

// BlogQuery → สำหรับ query params เวลาเรียก API list
export interface BlogQuery {
  page?: number;
  size?: number;
  q?: string;
  show?: "all" | "active"; // จะให้ backend ส่งแค่ active หรือทั้งหมด
}

// ใช้เวลาสร้าง blog ใหม่
export interface BlogCreateInput {
  title: string;
  content: string;
  file?: File | null; // แนบไฟล์รูปภาพ
}

// ใช้เวลาจะ update blog เดิม
export interface BlogUpdateInput {
  title?: string;
  content?: string;
  pin?: boolean;
  active?: boolean;
  file?: File | null;
}

// ---------- Config URL ----------
const API_BASE =
  (import.meta.env.VITE_API_BASE as string) ||
  "https://exam-api.dev.mis.cmu.ac.th/api";
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return API_BASE.replace(/\/api\/?$/, ""); // fallback: ตัด /api ทิ้ง เหลือแค่ origin
  }
})();

// ---------- Helper Functions ----------

// แก้ path ของรูปภาพ → ให้ได้ URL สมบูรณ์
export function fixImgUrl(rel?: string): string | undefined {
  if (!rel) return undefined;
  let clean = String(rel).replace(/\\/g, "/").trim(); // แทน \ ด้วย /

  if (/^https?:\/\//i.test(clean)) return clean; // ถ้าเป็น absolute URL แล้ว → ใช้เลย
  if (!clean.startsWith("/")) clean = "/" + clean; // ถ้าไม่มี / นำหน้า → เติมให้

  return API_ORIGIN.replace(/\/$/, "") + clean; // ต่อกับ origin ของ API
}

// แปลงวันเวลา iso → ภาษาไทย
export function toThaiDate(iso?: string): string {
  if (!iso) return "";
  return dayjs(iso).format("D MMM YYYY HH:mm น.");
}

// แปลงจาก ApiBlog (response จาก backend) → Blog (frontend model)
export function mapApiBlog(b: ApiBlog): Blog {
  // rawUrl อาจมาจากหลาย field เพราะ backend ไม่สม่ำเสมอ (Img, img, image)
  const rawUrl =
    (b as any)?.Img?.url ?? (b as any)?.img?.url ?? (b as any)?.image?.url;

  return {
    id: Number(b.id), // id → number
    title: String(b.title ?? ""), // title → string
    content: typeof b.content === "string" ? b.content : "", // เผื่อ content ไม่ใช่ string
    active: Boolean(b.active),
    pin: Boolean(b.pin),
    date: toThaiDate(b.createdAt), // format เป็นภาษาไทย
    thumbnail: fixImgUrl(typeof rawUrl === "string" ? rawUrl : undefined), // แก้ path รูป
    createdMs: b.createdAt ? new Date(b.createdAt).getTime() : 0, // เก็บ timestamp
    hit: typeof b.hit === "number" ? b.hit : undefined,
  };
}
