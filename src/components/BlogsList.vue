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
  pin: boolean;
  createdMs: number;
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

/* multiple select */
const selectedIds = ref<number[]>([]);
const bulkMode = ref(false);

/* Pagination */
const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const totalItems = ref<number>(0);

/*  Config  */
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
  return `${d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} ${d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })} น.`;
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
    pin: Boolean(b.pin),
    createdMs: b.createdAt ? new Date(b.createdAt).getTime() : 0,
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

/* breadcrumb (ถ้าต้องใช้) */
const emit = defineEmits<{ "detail-title": [string] }>();

/* เรียก list (/blogs) + pagination */
async function fetchList(): Promise<void> {
  const res = await Axios.get<ApiListResp | ApiAltResp | ApiBlog[]>(
    `${API_BASE}${BLOGS_INDEX}`,
    {
      headers: AUTH_HEADER,
      params: {
        page: currentPage.value,
        size: pageSize.value,
        q: search.value || undefined,
        show: showAll.value ? "all" : "active",
      },
    }
  );

  const payload = res.data;
  const rows: ApiBlog[] = Array.isArray(payload)
    ? payload
    : isApiListResp(payload)
      ? ((totalItems.value = payload.totalItems),
        (totalPages.value = payload.totalPages),
        payload.rows)
      : isApiAltResp(payload)
        ? payload.data
        : [];

  blogs.value = rows.map(mapApiBlog);
  emit("detail-title", "");

  /* CHANGE 1: เคลียร์ selection ที่อยู่นอกผลลัพธ์ หรือรายการที่ “เผยแพร่” */
  const idSet = new Set(blogs.value.map((b) => b.id));
  selectedIds.value = selectedIds.value.filter((id) => {
    const b = blogs.value.find((x) => x.id === id);
    return idSet.has(id) && b && !b.active;
  });
  /* /CHANGE 1 */
}

/* watchers เพื่อรีเฟรช */
watch(currentPage, refresh);
watch([pageSize, search], () => {
  currentPage.value = 1;
  refresh();
});
watch(() => route.params.id, refresh);
watch(showAll, () => {
  currentPage.value = 1;
  refresh();
});

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
    idParam.value !== null ? await fetchById(idParam.value) : await fetchList();
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

/*  Lifecycle  */
onMounted(refresh);

/* client filters */
const visibleBlogs = computed<Blogs[]>(() => {
  let list = blogs.value;
  if (!showAll.value) list = list.filter((b) => b.active);
  const q = search.value.trim().toLowerCase();
  if (q) list = list.filter((b) => b.title.toLowerCase().includes(q));
  return list
    .slice()
    .sort((a, b) => Number(b.pin) - Number(a.pin) || b.createdMs - a.createdMs);
});
const pagedBlogs = computed<Blogs[]>(() =>
  idParam.value !== null ? blogs.value : visibleBlogs.value
);

/* ---------- Multiple select constraints ---------- */
/* CHANGE 2: id ที่ “เลือกได้” บนหน้าปัจจุบัน = เฉพาะที่ซ่อนอยู่ */
const eligibleIdsOnPage = computed<number[]>(() =>
  pagedBlogs.value.filter((b) => !b.active).map((b) => b.id)
);
/* /CHANGE 2 */

/* CHANGE 3: isSelected ไม่ต้องเปลี่ยน แต่ toggleSelect จะกันเลือก item ที่เผยแพร่ */
const isSelected = (id: number) => selectedIds.value.includes(id);
function toggleSelect(id: number, checked: boolean) {
  const target = blogs.value.find((b) => b.id === id);
  if (!target || target.active) return; // กันติ๊กถ้าเผยแพร่
  const set = new Set(selectedIds.value);
  checked ? set.add(id) : set.delete(id);
  selectedIds.value = [...set];
}
/* /CHANGE 3 */

/* CHANGE 4: สถานะ some/all อิงจาก “eligibleIdsOnPage” เท่านั้น */
const someSelected = computed(() =>
  selectedIds.value.some((id) => eligibleIdsOnPage.value.includes(id))
);
const allSelected = computed(
  () =>
    eligibleIdsOnPage.value.length > 0 &&
    eligibleIdsOnPage.value.every((id) => selectedIds.value.includes(id))
);
function toggleSelectAll(checked: boolean) {
  const set = new Set(selectedIds.value);
  if (checked) eligibleIdsOnPage.value.forEach((id) => set.add(id));
  else eligibleIdsOnPage.value.forEach((id) => set.delete(id));
  selectedIds.value = [...set];
}
/* /CHANGE 4 */

/* ---------- Pin ---------- */
async function togglePin(blog: Blogs) {
  const next = !blog.pin;
  const prev = blog.pin;
  blog.pin = next;
  blogs.value = [...blogs.value];
  try {
    const { data } = await Axios.get<ApiBlog>(
      `${API_BASE}${BLOGS_INDEX}/${blog.id}`,
      { headers: AUTH_HEADER }
    );
    const fd = new FormData();
    fd.append("title", data.title ?? "");
    fd.append("content", data.content ?? "");
    fd.append("pin", String(next));
    await Axios.put(`${API_BASE}${BLOGS_INDEX}/${blog.id}`, fd, {
      headers: { ...AUTH_HEADER, "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    blog.pin = prev;
    blogs.value = [...blogs.value];
  }
}

// ⭐ CHANGED: เรียก refetch เพื่อเติมรายการให้ครบหลังเปลี่ยนสถานะ
async function updateActive(target: Blogs, next: boolean) {
  const prev = target.active
  // optimistic UI
  target.active = next
  blogs.value = [...blogs.value]

  try {
    const { data } = await Axios.get<ApiBlog>(`${API_BASE}${BLOGS_INDEX}/${target.id}`, {
      headers: AUTH_HEADER
    })

    // พยายามส่ง JSON ก่อน
    try {
      await Axios.put(
        `${API_BASE}${BLOGS_INDEX}/${target.id}`,
        { title: data.title ?? '', content: data.content ?? '', active: next },
        { headers: AUTH_HEADER }
      )
    } catch {
      // fallback เป็น multipart
      const fd = new FormData()
      fd.append('title', data.title ?? '')
      fd.append('content', data.content ?? '')
      fd.append('active', String(next))
      await Axios.put(`${API_BASE}${BLOGS_INDEX}/${target.id}`, fd, {
        headers: { ...AUTH_HEADER, 'Content-Type': 'multipart/form-data' },
      })
    }

    // ⭐ ADDED: ดึงข้อมูลหน้าเดิมใหม่เพื่อเติม item ให้ครบ
    await refreshAndFillPage()

  } catch (err) {
    // rollback
    target.active = prev
    blogs.value = [...blogs.value]
    console.error('update active failed:', err)
  } finally {
    if (target.active) {
      selectedIds.value = selectedIds.value.filter(id => id !== target.id)
    }
  }
}

/* ไปหน้าอื่น */
function goEdit(id: number) {
  router.push({ name: "blogs-update", params: { id } });
}
function goView(id: number) {
  router.push({ name: "blogs_id", params: { id } });
}

/* ---------- ลบ ---------- */
function askDelete(targetId: number, title: string) {
  deleteId.value = targetId;
  deleteTitle.value = title;
  deleteError.value = null;
  bulkMode.value = false;
  confirmOpen.value = true;
}
function askBulkDelete() {
  if (!someSelected.value) return;
  bulkMode.value = true;
  deleteId.value = null;
  deleteTitle.value = "";
  deleteError.value = null;
  confirmOpen.value = true;
}
async function confirmDelete() {
  try {
    deleting.value = true;
    if (bulkMode.value) {
      /* CHANGE 6: ลบเฉพาะ id ที่ “ซ่อนอยู่” เท่านั้น */
      const ids = selectedIds.value.filter((id) => {
        const b = blogs.value.find((x) => x.id === id);
        return b && !b.active;
      });
      if (!ids.length) {
        confirmOpen.value = false;
        return;
      }

      try {
        await Axios.post(
          `${API_BASE}${BLOGS_INDEX}/delete`,
          { ids },
          { headers: { ...AUTH_HEADER, "Content-Type": "application/json" } }
        );
      } catch {
        // fallback
        await Promise.allSettled(
          ids.map((id) =>
            Axios.delete(`${API_BASE}${BLOGS_INDEX}/${id}`, {
              headers: AUTH_HEADER,
            })
          )
        );
      }
      blogs.value = blogs.value.filter((b) => !ids.includes(b.id));
      selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
      // ⭐ ADDED
      await refreshAndFillPage();
    } else {
      if (deleteId.value == null) return;
      await Axios.delete(`${API_BASE}${BLOGS_INDEX}/${deleteId.value}`, {
        headers: AUTH_HEADER,
      });
      blogs.value = blogs.value.filter((b) => b.id !== deleteId.value);
      // ⭐ ADDED
      await refreshAndFillPage();
      selectedIds.value = selectedIds.value.filter(
        (id) => id !== deleteId.value
      );
    }
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

// ⭐ ADDED: refetch เพื่อให้หน้านี้ถูกเติมให้ครบหลังซ่อน/ลบ
async function refreshAndFillPage() {
  // ดึงหน้าเดิมก่อน
  await fetchList()

  // ถ้า currentPage เกินจำนวนหน้าจริง ให้ย้ายกลับไปหน้าสุดท้ายแล้วดึงใหม่
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
    await fetchList()
    return
  }

  // ถ้าหน้านี้ว่างแต่ยังมีหน้าก่อนหน้า → ถอยหนึ่งหน้าแล้วดึงใหม่
  if (blogs.value.length === 0 && currentPage.value > 1) {
    currentPage.value--
    await fetchList()
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 my-6">
    <template v-if="!$route.params.id">
      <div class="shadow rounded-lg p-4 bg-white">
        <BlogsHeader>
          <div class="flex items-center gap-2">
            <BlogsToggle v-model="showAll" />
            <span class="text-sm">แสดงทั้งหมด</span>
          </div>
        </BlogsHeader>

        <BlogsSearch v-model="search" />

        <!-- แสดงปุ่มลบเฉพาะเมื่อมีเลือก “ที่ซ่อนอยู่” -->
        <div v-if="someSelected" class="mb-2 flex items-center gap-3">
          <span class="text-sm text-gray-600">เลือกแล้ว
            {{
              selectedIds.filter((id) => eligibleIdsOnPage.includes(id)).length
            }}
            รายการ</span>
          <button class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
            @click="askBulkDelete">
            <TrashIcon class="w-4 h-4" /> ลบที่เลือก
          </button>
        </div>

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
                  <th class="p-2 w-12">
                    <!-- CHANGE 7: header checkbox เลือกเฉพาะที่ “ซ่อนอยู่” และปิดได้ถ้าไม่มีให้เลือก -->
                    <input type="checkbox" :checked="allSelected" :disabled="eligibleIdsOnPage.length === 0" @change="
                      toggleSelectAll(
                        ($event.target as HTMLInputElement).checked
                      )
                      " />
                    <!-- /CHANGE 7 -->
                  </th>
                  <th class="p-2">หัวข้อ</th>
                  <th class="p-2 text-right"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="blog in pagedBlogs" :key="blog.id">
                  <BlogsItem :blog="blog" :selected="isSelected(blog.id)"
                    @toggle-select="(checked: boolean) => toggleSelect(blog.id, checked)"
                    @update:active="(v) => updateActive(blog, v)" @view="goView(blog.id)" @edit="goEdit(blog.id)"
                    @delete="askDelete(blog.id, blog.title)" @pin="togglePin(blog)" 
                    @view="goView(blog.id)"
                    />
                    
                </template>
              </tbody>
            </table>
          </div>

          <!-- Mobile -->
          <div class="md:hidden space-y-4">
            <BlogsCard v-for="blog in pagedBlogs" :key="blog.id" :blog="blog" :selected="isSelected(blog.id)"
              @toggle-select="(checked: boolean) => toggleSelect(blog.id, checked)"
              @update:active="(v) => updateActive(blog, v)" @view="goView(blog.id)" @edit="goEdit(blog.id)"
              @delete="askDelete(blog.id, blog.title)" @pin="togglePin(blog)" />
          </div>
        </div>

        <BlogsFooter :total="totalItems" v-model:pageSize="pageSize" />
        <div class="mt-4 flex items-center justify-end gap-2">
          <button class="px-3 py-1 rounded border disabled:opacity-50 hover:bg-sky-200"
            :disabled="currentPage <= 1 || loading" @click="currentPage--">
            ก่อนหน้า
          </button>
          <span class="text-sm">หน้า {{ currentPage }} / {{ totalPages }}</span>
          <button class="px-3 py-1 rounded border disabled:opacity-50" :disabled="currentPage >= totalPages || loading"
            @click="currentPage++">
            ถัดไป
          </button>
        </div>
      </div>
    </template>

    <!-- โหมดรายละเอียด -->
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

    <!-- Confirm Delete Modal -->
    <div v-if="confirmOpen" class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="relative bg-white w-[92%] max-w-md rounded-2xl shadow-xl p-6">
        <div class="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <TrashIcon class="w-6 h-6 text-red-600" />
        </div>

        <template v-if="bulkMode">
          <h3 class="text-lg font-semibold text-center">
            ลบข้อมูล (หลายรายการ)
          </h3>
          <p class="text-center text-sm text-gray-600 mt-1">
            ยืนยันการลบ
            <b>{{
              selectedIds.filter((id) => eligibleIdsOnPage.includes(id)).length
            }}</b>
            รายการหรือไม่
          </p>
        </template>
        <template v-else>
          <h3 class="text-lg font-semibold text-center">ลบข้อมูล</h3>
          <p class="text-center text-sm text-gray-600 mt-1">
            ยืนยันการลบบทความ
            <span class="font-medium inline-block max-w-full break-all">“{{ deleteTitle }}”</span>
            หรือไม่
          </p>
        </template>

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
  </div>
</template>
