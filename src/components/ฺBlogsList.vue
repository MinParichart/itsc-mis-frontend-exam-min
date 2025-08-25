<script setup lang="ts">
import Axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import BlogsCard from './BlogsComponents/BlogsCard.vue'
import BlogsFooter from './BlogsComponents/BlogsFooter.vue'
import BlogsHeader from './BlogsComponents/BlogsHeader.vue'
import BlogsItem from './BlogsComponents/BlogsItem.vue'
import BlogsSearch from './BlogsComponents/BlogsSearch.vue'
import BlogsToggle from './BlogsComponents/BlogsToggle.vue'

/** ================= UI model ================= */
interface Blogs {
  id: number
  title: string
  date: string
  thumbnail?: string
  active: boolean
}

/** ================= API types ================= */
type ApiImage = { url?: string }
interface ApiBlog {
  id: number | string
  title?: string
  content?: string
  hit?: number
  pin?: boolean
  active?: boolean
  createdAt?: string
  updatedAt?: string
  img?: ApiImage
  Img?: ApiImage
}

interface ApiListResp {
  totalItems: number
  rows: ApiBlog[]
  totalPages: number
  currentPage: number
}

interface ApiAltResp {
  data: ApiBlog[]
}

interface ApiErrorPayload {
  message?: string
  error?: string
  errors?: Record<string, unknown>
}

/** ================= State ================= */
const showAll  = ref(false)   // true = แสดงทุกบทความ, false = เฉพาะ active
const search   = ref('')
const pageSize = ref(10)
const blogs    = ref<Blogs[]>([])
const loading  = ref(false)
const error    = ref<string | null>(null)

/** ================= Config (.env รองรับ, มี default) ================= */
const API_BASE    = (import.meta.env.VITE_API_BASE as string)       || 'https://exam-api.dev.mis.cmu.ac.th/api'
const BLOGS_INDEX = (import.meta.env.VITE_API_BLOGS_INDEX as string) || '/blogs'
const AUTH_HEADER: Record<string, string> = { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }

/** origin สำหรับรูป (ตัด "/api" ท้าย base ออก) */
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '')

/** ================= Helpers ================= */
function toThaiDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  const date = d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date} ${time} น.`
}

function fixImgUrl(u?: string): string | undefined {
  if (!u) return undefined
  const clean = u.replace(/\\/g, '/')
  if (/^https?:\/\//.test(clean)) return clean
  return `${API_ORIGIN}${clean.startsWith('/') ? '' : '/'}${clean}`
}

/** type guards สำหรับ payload รูปแบบต่าง ๆ */
function isApiListResp(x: unknown): x is ApiListResp {
  return !!x && typeof x === 'object' && 'rows' in x
}
function isApiAltResp(x: unknown): x is ApiAltResp {
  return !!x && typeof x === 'object' && 'data' in x
}

/** ================= Fetch ================= */
async function fetchBlogs(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const res = await Axios.get<ApiListResp | ApiAltResp | ApiBlog[]>(
      `${API_BASE}${BLOGS_INDEX}`,
      {
        headers: AUTH_HEADER,
        params: {
          page: 1, // ถ้ามี state สำหรับเลขหน้า ค่อยผูกเพิ่ม
          size: pageSize.value,
          q: search.value || undefined,
          show: showAll.value ? 'all' : 'active',
        },
      }
    )

    const payload = res.data
    // รองรับทั้ง {rows: [...]}, {data: [...]}, หรือ [] ตรง ๆ
    const rows: ApiBlog[] = Array.isArray(payload)
      ? payload
      : isApiListResp(payload)
        ? payload.rows
        : isApiAltResp(payload)
          ? payload.data
          : []

    blogs.value = rows.map((b): Blogs => ({
      id: Number(b.id),
      title: String(b.title ?? ''),
      date: toThaiDate(b.createdAt),
      thumbnail: fixImgUrl(b.img?.url ?? b.Img?.url),
      active: Boolean(b.active),
    }))
  } catch (e: unknown) {
    let msg = 'โหลดข้อมูลไม่สำเร็จ'
    if (Axios.isAxiosError<ApiErrorPayload>(e)) {
      msg = e.response?.data?.message ?? e.message ?? msg
    } else if (e instanceof Error) {
      msg = e.message
    } else {
      msg = String(e)
    }
    error.value = msg
  } finally {
    loading.value = false
  }
}

/** ================= Lifecycle / Watch ================= */
onMounted(fetchBlogs)
watch([showAll, pageSize, search], fetchBlogs)

/** ================= Client filters (UI เดิม) ================= */
const visibleBlogs = computed<Blogs[]>(() =>
  blogs.value.filter(a =>
    a.title.toLowerCase().includes(search.value.toLowerCase())
  )
)
const pagedBlogs = computed<Blogs[]>(() => visibleBlogs.value.slice(0, pageSize.value))

/** toggle active (รับจาก child) */
const setActive = (target: Blogs, next: boolean) => { target.active = next }
</script>

<template>
  <div class="container mx-auto shadow rounded-lg p-4 my-5">
    <!-- Header + Toggle -->
    <BlogsHeader>
      <div class="flex items-center gap-2">
        <BlogsToggle v-model="showAll" />
        <span class="text-sm">แสดงทั้งหมด</span>
      </div>
    </BlogsHeader>

    <BlogsSearch v-model="search" />

    <!-- loading / error -->
    <div v-if="loading" class="p-6 text-center text-gray-500">กำลังโหลด...</div>
    <div v-else-if="error" class="p-6 text-center text-red-600">{{ error }}</div>

    <!-- content -->
    <div v-else class="overflow-x-auto">
      <!-- Desktop Table -->
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
              <BlogsItem
                :blog="blog"
                @update:active="(v)=>setActive(blog, v)"
                @share="() => {}"
                @edit="() => {}"
                @delete="() => {}"
                @pin="() => {}"
              />
            </template>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden space-y-4">
        <BlogsCard
          v-for="blog in pagedBlogs"
          :key="blog.id"
          :blog="blog"
          @update:active="(v)=>setActive(blog, v)"
          @share="() => {}"
          @edit="() => {}"
          @delete="() => {}"
          @pin="() => {}"
        />
      </div>
    </div>

    <BlogsFooter :total="pagedBlogs.length" v-model:pageSize="pageSize" />
  </div>
</template>
