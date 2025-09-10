// src/services/blogService.ts
// NEW: รวม API ของ blog ทั้งหมด

import type { ApiAltResp, ApiBlog, ApiListResp } from "@/models/api";
import api from "@/plugins/axios";

// list (รองรับ 2 payload รูปแบบที่คุณเจอ)
export async function fetchBlogs(params: {
  page: number;
  size: number;
  q?: string;
  show?: "all" | "active";
}) {
  const { data } = await api.get<ApiListResp | ApiAltResp | ApiBlog[]>("/blogs", { params });

  const rows: ApiBlog[] = Array.isArray(data)
    ? data
    : "rows" in (data as any)
    ? (data as ApiListResp).rows
    : "data" in (data as any)
    ? (data as ApiAltResp).data
    : [];

  const meta = {
    totalItems: "totalItems" in (data as any) ? (data as ApiListResp).totalItems : rows.length,
    totalPages: "totalPages" in (data as any) ? (data as ApiListResp).totalPages : 1,
    currentPage: "currentPage" in (data as any) ? (data as ApiListResp).currentPage : params.page,
  };

  return { rows, meta };
}

export async function fetchBlogById(id: number) {
  const { data } = await api.get<ApiBlog>(`/blogs/${id}`);
  return data;
}

// create (multipart)
export async function createBlog(payload: { title: string; content: string; file?: File | null }) {
  const fd = new FormData();
  fd.append("title", payload.title);
  fd.append("content", payload.content);
  if (payload.file) fd.append("blog_img", payload.file);
  const { data } = await api.post<ApiBlog>("/blogs", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// update (multipart)
export async function updateBlog(
  id: number,
  payload: { title: string; content: string; file?: File | null; active?: boolean; pin?: boolean }
) {
  const fd = new FormData();
  fd.append("title", payload.title);
  fd.append("content", payload.content);
  if (typeof payload.active === "boolean") fd.append("active", String(payload.active));
  if (typeof payload.pin === "boolean") fd.append("pin", String(payload.pin));
  if (payload.file) fd.append("blog_img", payload.file);
  const { data } = await api.put<ApiBlog>(`/blogs/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// toggle pin (โหลดเดิมมาเติมฟิลด์บังคับแล้วอัปเดต)
export async function togglePin(id: number, next: boolean) {
  const current = await fetchBlogById(id);
  return updateBlog(id, { title: current.title ?? "", content: current.content ?? "", pin: next });
}

// delete
export async function deleteBlog(id: number) {
  await api.delete(`/blogs/${id}`);
}
