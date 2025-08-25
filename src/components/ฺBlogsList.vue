<script setup lang="ts">
import Axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BlogsCard from './BlogsComponents/BlogsCard.vue'
import BlogsFooter from './BlogsComponents/BlogsFooter.vue'
import BlogsHeader from './BlogsComponents/BlogsHeader.vue'
import BlogsItem from './BlogsComponents/BlogsItem.vue'
import BlogsSearch from './BlogsComponents/BlogsSearch.vue'
import BlogsToggle from './BlogsComponents/BlogsToggle.vue'

/* ================= UI model ================= */
interface Blogs {
  id: number
  title: string
  date: string
  thumbnail?: string
  active: boolean
}

/* ================= API types ================= */
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
interface ApiListResp { totalItems: number; rows: ApiBlog[]; totalPages: number; currentPage: number }
interface ApiAltResp  { data: ApiBlog[] }
interface ApiErrorPayload { message?: string; error?: string }

/* ================= State ================= */
const route = useRoute()
const showAll  = ref(false)
const search   = ref('')
const pageSize = ref(10)
const blogs    = ref<Blogs[]>([])
const loading  = ref(false)
const error    = ref<string | null>(null)

/* ================= Config ================= */
const API_BASE    = (import.meta.env.VITE_API_BASE as string)        || 'https://exam-api.dev.mis.cmu.ac.th/api'
const BLOGS_INDEX = (import.meta.env.VITE_API_BLOGS_INDEX as string) || '/blogs'
const AUTH_HEADER: Record<string,string> = { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '')

/* ================= Helpers ================= */
function toThaiDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  const date = d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date} ${time} น.`
}
function fixImgUrl(u?: string): string | undefined {
  if (!u) return undefined
  const clean = u.replace(/\\/g, '/').replace(/^\/+/, '/')
  if (/^https?:\/\//i.test(clean)) return clean
  const origin = API_ORIGIN.replace(/\/+$/, '')
  return `${origin}${clean.startsWith('/') ? '' : '/'}${clean}`
}
function mapApiBlog(b: ApiBlog): Blogs {
  return {
    id: Number(b.id),
    title: String(b.title ?? ''),
    date: toThaiDate(b.createdAt),
    thumbnail: fixImgUrl(b.img?.url ?? b.Img?.url),
    active: Boolean(b.active),
  }
}
function isApiListResp(x: unknown): x is ApiListResp { return !!x && typeof x === 'object' && 'rows' in x }
function isApiAltResp (x: unknown): x is ApiAltResp  { return !!x && typeof x === 'object' && 'data' in x }

/* อ่าน id จาก URL ถ้ามี */
const idParam = computed<number | null>(() => {
  const v = route.params.id
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
})

/* ========== เรียก list (/blogs) ========== */
async function fetchList(): Promise<void> {
  const res = await Axios.get<ApiListResp | ApiAltResp | ApiBlog[]>(
    `${API_BASE}${BLOGS_INDEX}`,
    {
      headers: AUTH_HEADER,
      params: {
        page: 1,
        size: pageSize.value,
        q: search.value || undefined,
        show: showAll.value ? 'all' : 'active',
      },
    }
  )
  const payload = res.data
  const rows: ApiBlog[] = Array.isArray(payload)
    ? payload
    : isApiListResp(payload)
      ? payload.rows
      : isApiAltResp(payload)
        ? payload.data
        : []
  blogs.value = rows.map(mapApiBlog)
}

/* ========== เรียก by id (/blogs/:id) ========== */
async function fetchById(id: number): Promise<void> {
  const { data } = await Axios.get<ApiBlog>(`${API_BASE}${BLOGS_INDEX}/${id}`, { headers: AUTH_HEADER })
  blogs.value = [mapApiBlog(data)]
}

/* ========== เลือกว่าจะดึงแบบไหน ========== */
async function refresh(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    if (idParam.value !== null) {
      await fetchById(idParam.value)   // มี id ใน URL → ดึงตัวเดียว
    } else {
      await fetchList()                 // ไม่มี id → ดึงเป็น list
    }
  } catch (e: unknown) {
    let msg = 'โหลดข้อมูลไม่สำเร็จ'
    if (Axios.isAxiosError<ApiErrorPayload>(e)) msg = e.response?.data?.message ?? e.message ?? msg
    else if (e instanceof Error) msg = e.message
    else msg = String(e)
    error.value = msg
    blogs.value = []
  } finally {
    loading.value = false
  }
}

/* ================= Lifecycle & Watch ================= */
onMounted(refresh)
watch([showAll, pageSize, search, () => route.params.id], refresh)

/* ================= Client filters (ใช้เฉพาะตอน list) ================= */
const visibleBlogs = computed<Blogs[]>(() => {
  // ถ้าเป็นโหมดดูตามไอดี ให้โชว์ทั้งก้อน ไม่ต้องกรอง
  if (idParam.value !== null) return blogs.value
  return blogs.value.filter(b => b.title.toLowerCase().includes(search.value.toLowerCase()))
})
const pagedBlogs = computed<Blogs[]>(() => {
  if (idParam.value !== null) return blogs.value
  return visibleBlogs.value.slice(0, pageSize.value)
})

/* toggle active (รับจาก child) */
const setActive = (target: Blogs, next: boolean) => { target.active = next }
</script>

<template>
  <div class="container mx-auto shadow rounded-lg p-4 my-5">
    <BlogsHeader>
      <div class="flex items-center gap-2">
        <BlogsToggle v-model="showAll" />
        <span class="text-sm">แสดงทั้งหมด</span>
      </div>
    </BlogsHeader>

    <BlogsSearch v-if="!$route.params.id" v-model="search" />

    <div v-if="loading" class="p-6 text-center text-gray-500">กำลังโหลด...</div>
    <div v-else-if="error" class="p-6 text-center text-red-600">{{ error }}</div>

    <div v-else class="overflow-x-auto">
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

    <BlogsFooter v-if="!$route.params.id" :total="pagedBlogs.length" v-model:pageSize="pageSize" />
  </div>
</template>
