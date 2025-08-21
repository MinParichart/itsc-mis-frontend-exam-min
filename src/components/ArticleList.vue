<script setup lang="ts">
import { computed, ref } from 'vue'
import ArticleFooter from './ArticleComponents/ArticleFooter.vue'
import ArticleHeader from './ArticleComponents/ArticleHeader.vue'
import ArticleItem from './ArticleComponents/ArticleItem.vue'
import ArticleSearch from './ArticleComponents/ArticleSearch.vue'
import ArticleToggle from './ArticleComponents/ArticleToggle.vue'

interface Article {
  id: number
  title: string
  date: string
  thumbnail?: string
  active: boolean
}

const showAll  = ref(false)   // true = แสดงทุกบทความ, false = เฉพาะ active
const search   = ref('')
const pageSize = ref(10)

// ข้อมูลของคุณ
const articles = ref<Article[]>([
  { id: 1,  title: 'Concert in Thailand', date: '10 ก.พ. 2567 08:15 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id: 2,  title: 'The Rose Music',      date: '10 ก.พ. 2567 23:18 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: false },
  { id: 3,  title: 'Crab Omlet in Thailand', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true },
  { id: 4,  title: 'Taylor Swiftt concert in Thailand', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true },
  { id: 5,  title: 'I will eat everything today', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true },
  { id: 6,  title: 'Mission to the mar', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true },
  { id: 7,  title: 'Music pop na rock a', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true },
  { id: 8,  title: 'Art is everywhere', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true },
  { id: 9,  title: 'Advice not command', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true },
  { id:10,  title: 'How to survise in Thailand', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true },
  { id:11,  title: 'Word in Thai you should know', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true },
  { id:12,  title: 'Become Youth again', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true }
])

/** กรองตาม showAll + search */
const visibleArticles = computed<Article[]>(() =>
  articles.value.filter(a => {
    const passActive = showAll.value ? true : a.active
    const passSearch = a.title.toLowerCase().includes(search.value.toLowerCase())
    return passActive && passSearch
  })
)

/** ตัดจำนวนตาม pageSize */
const pagedArticles = computed<Article[]>(() =>
  visibleArticles.value.slice(0, pageSize.value)
)

/** อัปเดตค่า active (รับจาก child) */
const setActive = (target: Article, next: boolean) => {
  target.active = next
}
</script>

<template>
  <div class="container mx-auto shadow rounded-lg p-4 my-5">
    <!-- Header + toggle แสดงทั้งหมด -->
    <ArticleHeader>
      <div class="flex items-center space-x-2">
        <ArticleToggle v-model="showAll" />
        <span class="text-sm">แสดงทั้งหมด</span>
      </div>
    </ArticleHeader>

    <ArticleSearch v-model="search" />

    <!-- ตาราง (desktop) -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse hidden md:table">
        <thead>
        <tr class="bg-gray-100 text-left text-sm text-gray-600">
          <th class="p-2 w-12"><input type="checkbox" /></th>
          <th class="p-2">หัวข้อ</th>
          <th class="p-2 text-right"></th>
        </tr>
        </thead>
        <tbody>
          <template v-for="article in pagedArticles" :key="article.id">
            <ArticleItem
              :article="article"
              @update:active="(v)=>setActive(article, v)"
              @share="() => {}"
              @edit="() => {}"
              @delete="() => {}"
              @pin="() => {}"
            />
          </template>
        </tbody>
      </table>

      <!-- Mobile card layout (เหมือนเดิม) -->
      <div class="md:hidden space-y-4">
        <div
          v-for="article in pagedArticles"
          :key="article.id"
          class="border rounded-lg p-3 bg-white shadow-sm"
        >
          <div class="flex items-start space-x-3">
            <input type="checkbox" class="mt-2" />
            <img v-if="article.thumbnail" :src="article.thumbnail" alt="thumb" class="w-16 h-16 rounded object-cover" />
            <div class="flex flex-col flex-1">
              <span class="font-bold text-gray-700">{{ article.title }}</span>
              <span class="text-sm text-gray-500">📆 {{ article.date }}</span>
            </div>
          </div>

          <div class="flex flex-col items-end mt-3 space-y-2">
            <div class="flex items-center space-x-2">
              <button class="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="ปักหมุด">📌</button>
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" class="hidden" v-model="article.active" />
                <div class="w-10 h-5 rounded-full relative transition-colors"
                     :class="article.active ? 'bg-blue-500' : 'bg-gray-300'">
                  <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                       :class="{ 'translate-x-5': article.active }" />
                </div>
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <button class="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" title="แชร์">📤</button>
              <button class="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200" title="แก้ไข">✏️</button>
              <button v-if="!article.active" class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200" title="ลบ">🗑</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <ArticleFooter :total="pagedArticles.length" v-model:pageSize="pageSize" />
  </div>
</template>
