<script setup lang="ts">
import { TrashIcon } from "@heroicons/vue/24/solid";
import Axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BlogsCard from "./BlogsComponents/BlogsCard.vue";
import BlogsDetail from "./BlogsComponents/BlogsDetail.vue";
import BlogsFooter from "./BlogsComponents/BlogsFooter.vue";
import BlogsHeader from "./BlogsComponents/BlogsHeader.vue";
import BlogsItem from "./BlogsComponents/BlogsItem.vue";
import BlogsSearch from "./BlogsComponents/BlogsSearch.vue";
import BlogsToggle from "./BlogsComponents/BlogsToggle.vue";

/*  UI model  */
interface Blogs {
  id: number;
  title: string;
  date: string;
  thumbnail?: string;
  active: boolean;
  content?: string;
  pin: boolean; // เพิ่ม
  createdMs: number; //ไว้เป็นคีย์เรียงรองลงมา (ล่าสุดก่อน)
}

/*  API types  */
type ApiImage = { url?: string };

interface ApiBlog {
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

interface ApiListResp {
  totalItems: number;
  rows: ApiBlog[];
  totalPages: number;
  currentPage: number;
}

interface ApiAltResp {
  data: ApiBlog[];
}

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

/*  State  */
const router = useRouter();
const route = useRoute();
const showAll = ref(false);
const search = ref("");
const pageSize = ref(10);
const blogs = ref<Blogs[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

/*  State ของการลบ   */
const confirmOpen = ref(false);
const deleteId = ref<number | null>(null);
const deleteTitle = ref("");
const deleting = ref(false);
const deleteError = ref<string | null>(null);

/*  Config - Move to Service  */
const API_BASE =
  (import.meta.env.VITE_API_BASE as string) ||
  "https://exam-api.dev.mis.cmu.ac.th/api";

const BLOGS_INDEX =
  (import.meta.env.VITE_API_BLOGS_INDEX as string) || "/blogs";

const AUTH_HEADER: Record<string, string> = {
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
};

const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

/*  Helpers  */
function toThaiDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const date = d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time} น.`;
}

function fixImgUrl(u?: string): string | undefined {
  if (!u) return undefined;
  const clean = u.replace(/\\/g, "/").replace(/^\/+/, "/");
  if (/^https?:\/\//i.test(clean)) return clean;
  const origin = API_ORIGIN.replace(/\/+$/, "");
  return `${origin}${clean.startsWith("/") ? "" : "/"}${clean}`;
}

function mapApiBlog(b: ApiBlog): Blogs {
  return {
    id: Number(b.id),
    title: String(b.title ?? ""),
    date: toThaiDate(b.createdAt),
    thumbnail: fixImgUrl(b.img?.url ?? b.Img?.url),
    active: Boolean(b.active),
    content: typeof b.content === "string" ? b.content : "",
    pin: Boolean(b.pin), // map ค่าปักหมุด
    createdMs: b.createdAt ? new Date(b.createdAt).getTime() : 0, // คีย์เรียง
  };
}

function isApiListResp(x: unknown): x is ApiListResp {
  return !!x && typeof x === "object" && "rows" in x;
}

function isApiAltResp(x: unknown): x is ApiAltResp {
  return !!x && typeof x === "object" && "data" in x;
}

/*  อ่าน id จาก URL ถ้ามี   */
const idParam = computed<number | null>(() => {
  const v = route.params.id;
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
});

/*  ส่งชื่อเรื่องขึ้นไปไว้ทำ breadcrumb ที่ BlogsView (ถ้าต้องใช้)  */
const emit = defineEmits<{ "detail-title": [string] }>();

/* เรียก list (/blogs) */
async function fetchList(): Promise<void> {
  const res = await Axios.get<ApiListResp | ApiAltResp | ApiBlog[]>(
    `${API_BASE}${BLOGS_INDEX}`,
    {
      headers: AUTH_HEADER,
      params: {
        page: 1,
        size: pageSize.value,
        q: search.value || undefined,
        show: "all",
      },
    }
  );
  const payload = res.data;
  const rows: ApiBlog[] = Array.isArray(payload)
    ? payload
    : isApiListResp(payload)
      ? payload.rows
      : isApiAltResp(payload)
        ? payload.data
        : [];
  blogs.value = rows.map(mapApiBlog);
  emit("detail-title", "");
}

/* เรียก by id (/blogs/:id) */
async function fetchById(id: number): Promise<void> {
  const { data } = await Axios.get<ApiBlog>(`${API_BASE}${BLOGS_INDEX}/${id}`, {
    headers: AUTH_HEADER,
  });
  blogs.value = [mapApiBlog(data)];
  emit("detail-title", blogs.value[0]?.title || "");
}

/* เลือกว่าจะดึงแบบไหน */
async function refresh(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    if (idParam.value !== null) {
      await fetchById(idParam.value);
    } else {
      await fetchList();
    }
  } catch (e: unknown) {
    let msg = "โหลดข้อมูลไม่สำเร็จ";
    if (Axios.isAxiosError<ApiErrorPayload>(e))
      msg = e.response?.data?.message ?? e.message ?? msg;
    else if (e instanceof Error) msg = e.message;
    else msg = String(e);
    error.value = msg;
    blogs.value = [];
  } finally {
    loading.value = false;
  }
}

/*  Lifecycle & Watch  */
onMounted(refresh);
watch([pageSize, search, () => route.params.id], refresh); // ตัด showAll, ออก

/*  Client filters (ใช้เฉพาะตอน list)  */
const visibleBlogs = computed<Blogs[]>(() => {
  // โหมดดูรายละเอียด >> ไม่ต้องกรองอะไร
  if (idParam.value !== null) return blogs.value;

  // กรองด้วยคำค้นก่อน
  const bySearch = blogs.value.filter((b) =>
    b.title.toLowerCase().includes(search.value.toLowerCase())
  );

  // ถ้า "แสดงทั้งหมด" = true → ส่งคืนทั้งหมด
  // ถ้า false → แสดงเฉพาะที่ active เท่านั้น
  // โหมดแสดงทั้งหมด/เฉพาะเผยแพร่
  const filtered = showAll.value ? bySearch : bySearch.filter((b) => b.active);

  // เรียง: ปักหมุดก่อน แล้วค่อยล่าสุดก่อน
  return filtered
    .slice()
    .sort((a, b) => Number(b.pin) - Number(a.pin) || b.createdMs - a.createdMs);
});

// ฟังก์ชัน togglePin และเรียกใช้จริง
// BlogsList.vue
async function togglePin(blog: Blogs) {
  const next = !blog.pin;
  const prev = blog.pin;

  // optimistic UI
  blog.pin = next;
  blogs.value = [...blogs.value]; // กระตุ้นคำนวณ sort ใหม่

  try {
    // โหลดของเดิมเพื่อกรอกฟิลด์ที่ API บังคับ
    const { data } = await Axios.get<ApiBlog>(
      `${API_BASE}${BLOGS_INDEX}/${blog.id}`,
      { headers: AUTH_HEADER }
    );

    // ✅ เลือกอย่างใดอย่างหนึ่งตามแบ็กเอนด์ของคุณ

    // 1) ถ้า API รับ JSON ปกติ:
    // await Axios.put(
    //   `${API_BASE}${BLOGS_INDEX}/${blog.id}`,
    //   { title: data.title ?? '', content: data.content ?? '', pin: next },
    //   { headers: AUTH_HEADER }
    // )

    // 2) ถ้า API บังคับ multipart (ตามคู่มือของคุณ):
    const fd = new FormData();
    fd.append("title", data.title ?? "");
    fd.append("content", data.content ?? "");
    // ถ้าแบ็กเอนด์รองรับการอ่านฟิลด์ pin ใน multipart:
    fd.append("pin", String(next));
    await Axios.put(`${API_BASE}${BLOGS_INDEX}/${blog.id}`, fd, {
      headers: { ...AUTH_HEADER, "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    // ถ้าพลาดให้ rollback
    blog.pin = prev;
    blogs.value = [...blogs.value];
    console.error("toggle pin failed:", err);
  }
}

const pagedBlogs = computed<Blogs[]>(() => {
  if (idParam.value !== null) return blogs.value;
  return visibleBlogs.value.slice(0, pageSize.value);
});

/* toggle active (จาก child) */
const setActive = (target: Blogs, next: boolean) => {
  target.active = next;
};

/* ---------- Edit or Update in BlogsList.vue ---------- */

function goEdit(id: number) {
  router.push({ name: "blogs-update", params: { id } });
}

/* ---------- Detail in BlogsList.vue ---------- */
function goView(id: number) {
  router.push({ name: "blogs_id", params: { id } });
}

/* ---------- ลบ: modal + API ---------- */
function askDelete(targetId: number, title: string) {
  deleteId.value = targetId;
  deleteTitle.value = title;
  deleteError.value = null;
  confirmOpen.value = true;
}

async function confirmDelete() {
  if (deleteId.value == null) return;
  try {
    deleting.value = true;
    await Axios.delete(`${API_BASE}${BLOGS_INDEX}/${deleteId.value}`, {
      headers: AUTH_HEADER,
    });
    blogs.value = blogs.value.filter((b) => b.id !== deleteId.value);
    confirmOpen.value = false;
  } catch (e: any) {
    deleteError.value =
      (Axios.isAxiosError(e) &&
        (e.response?.data?.message || e.response?.data?.error)) ||
      e?.message ||
      "ลบไม่สำเร็จ";
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 my-6">
    <!-- โหมดรายการ -->
    <template v-if="!$route.params.id">
      <div class="shadow rounded-lg p-4 bg-white">
        <BlogsHeader>
          <div class="flex items-center gap-2">
            <!-- ส่ง BlogsToggle เข้าไปใน slot ของ BlogsHeader -->
            <BlogsToggle v-model="showAll" />
            <span class="text-sm">แสดงทั้งหมด</span>
          </div>
        </BlogsHeader>

        <BlogsSearch v-model="search" />

        <div v-if="loading" class="p-6 text-center text-gray-500">
          กำลังโหลด...
        </div>
        <div v-else-if="error" class="p-6 text-center text-red-600">
          {{ error }}
        </div>

        <div v-else class="overflow-x-auto">
          <!-- Desktop -->
          <div class="hidden md:block min-w-[720px]">
            <table class="w-full border-collapse table-auto">
              <thead>
                <tr class="bg-gray-100 text-left text-sm text-gray-600">
                  <th class="p-2 w-12"><input type="checkbox" /></th>
                  <th class="p-2">หัวข้อ</th>
                  <th class="p-2 text-right"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="blog in pagedBlogs" :key="blog.id">
                  <BlogsItem :blog="blog" @update:active="(v) => setActive(blog, v)" @view="goView(blog.id)"
                    @edit="goEdit(blog.id)" @delete="askDelete(blog.id, blog.title)" @pin="togglePin(blog)" />
                </template>
              </tbody>
            </table>
          </div>

          <!-- Mobile -->
          <div class="md:hidden space-y-4">
            <BlogsCard v-for="blog in pagedBlogs" :key="blog.id" :blog="blog" @update:active="(v) => setActive(blog, v)"
              @view="goView(blog.id)" @edit="goEdit(blog.id)" @delete="askDelete(blog.id, blog.title)"
              @pin="togglePin(blog)" />
          </div>
        </div>

        <BlogsFooter :total="pagedBlogs.length" v-model:pageSize="pageSize" />
      </div>
    </template>

    <!-- โหมดรายละเอียด: /blogs/:id -->
    <template v-else>
      <div v-if="loading" class="p-6 text-center text-gray-500 bg-white rounded-lg shadow">
        กำลังโหลด...
      </div>
      <div v-else-if="error" class="p-6 text-center text-red-600 bg-white rounded-lg shadow">
        {{ error }}
      </div>

      <div v-else-if="blogs.length">
        <BlogsDetail :blog="blogs[0]" />
      </div>

      <div v-else class="p-6 text-center text-gray-500 bg-white rounded-lg shadow">
        ไม่พบบทความนี้
      </div>
    </template>

    <!--  Confirm Delete Modal  -->
    <div v-if="confirmOpen" class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <!-- backdrop -->
      <div class="absolute inset-0 bg-black/40"></div>

      <!-- dialog -->
      <div class="relative bg-white w-[92%] max-w-md rounded-2xl shadow-xl p-6">
        <div class="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <TrashIcon class="w-6 h-6 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-center">ลบข้อมูล</h3>
        <p class="text-center text-sm text-gray-600 mt-1">
          ยืนยันการลบบทความ
          <span class="font-medium inline-block max-w-full break-all">“{{ deleteTitle }}”</span> หรือไม่
        </p>
        <p v-if="deleteError" class="text-center text-sm text-red-600 mt-2">
          {{ deleteError }}
        </p>

        <div class="mt-5 grid grid-cols-2 gap-3">
          <button type="button" class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            @click="confirmOpen = false" :disabled="deleting">
            ยกเลิก
          </button>
          <button type="button" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
            @click="confirmDelete" :disabled="deleting">
            {{ deleting ? "กำลังลบ..." : "ลบ" }}
          </button>
        </div>
      </div>
    </div>
    <!--  /Confirm Delete Modal  -->
  </div>
</template>
