// src/models/api.ts

// ---------- Type ของรูปภาพ ----------
export type ApiImage = { url?: string };
// ใช้แทน object ที่เป็นรูปภาพจาก API (มีแค่ property url แบบ optional)

// ---------- Interface ของ Blog ----------
export interface ApiBlog {
  id: number | string; // ไอดีบทความ (อาจเป็นตัวเลขหรือ string ก็ได้)
  title?: string; // ชื่อบทความ
  content?: string; // เนื้อหาบทความ
  hit?: number; // จำนวนครั้งที่มีคนเข้าชม (view count)
  pin?: boolean; // ปักหมุดหรือไม่
  active?: boolean; // สถานะเผยแพร่หรือไม่
  createdAt?: string; // วันเวลาที่สร้าง
  updatedAt?: string; // วันเวลาที่แก้ไขล่าสุด
  img?: ApiImage; // รูปภาพ (field ปกติ)
  Img?: ApiImage; // รูปภาพ (บาง API ใช้ตัว I ใหญ่ → รองรับทั้งสองกรณี)
}

// ---------- Interface ของการตอบแบบ list ----------
export interface ApiList<T> {
  totalItems: number; // จำนวนรายการทั้งหมด
  rows: T[]; // array ของข้อมูล (generic T เช่น ApiBlog[])
  totalPages: number; // จำนวนหน้าทั้งหมด
  currentPage: number; // หน้าที่กำลังแสดง
}

// ---------- REST endpoints ----------
// เก็บ URL base ของ API (ดึงจาก .env ถ้ามี ไม่งั้นใช้ default)
export const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string) ||
  "https://exam-api.dev.mis.cmu.ac.th/api";

// path ของ blogs index (รายการทั้งหมด)
export const BLOGS_INDEX = "/blogs";

// ฟังก์ชันสร้าง path บทความตาม id
export const BLOG_BY_ID = (id: number | string) => `/blogs/${id}`;

// endpoint สำหรับลบรูปของ blog
export const BLOG_REMOVE_IMAGE = (id: number | string) =>
  `/blogs/${id}/remove-image`;

// endpoint สำหรับลบหลายรายการพร้อมกัน
export const BLOG_DELETE_MANY = "/blogs/delete";
