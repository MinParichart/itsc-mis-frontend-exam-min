<script setup lang="ts">
import { computed, ref } from 'vue'
import ArticleCard from './ArticleComponents/ArticleCard.vue'
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

const articles = ref<Article[]>([
  { id: 1,  title: 'Concert in Thailand',            date: '10 ก.พ. 2567 08:15 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id: 2,  title: 'The Rose Music',                 date: '10 ก.พ. 2567 23:18 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: false },
  { id: 3,  title: 'Crab Omlet in Thailand',         date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id: 4,  title: 'Taylor Swiftt concert in Thailand', date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id: 5,  title: 'I will eat everything today',    date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id: 6,  title: 'Mission to the mar',             date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id: 7,  title: 'Music pop na rock a',            date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id: 8,  title: 'Art is everywhere',              date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id: 9,  title: 'Advice not command',             date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id:10,  title: 'How to survise in Thailand',     date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id:11,  title: 'Word in Thai you should know',   date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  },
  { id:12,  title: 'Become Youth again',             date: '10 ก.พ. 2567 21:00 น.', thumbnail: 'https://shorturl.asia/ntaxE', active: true  }
])

/** กรอง: showAll + คำค้นหา */
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
const setActive = (target: Article, next: boolean) => { target.active = next }
</script>

<template>
  <div class="container mx-auto shadow rounded-lg p-4 my-5">
    <!-- Header + Toggle -->
    <ArticleHeader>
      <div class="flex items-center gap-2">
        <ArticleToggle v-model="showAll" />
        <span class="text-sm">แสดงทั้งหมด</span>
      </div>
    </ArticleHeader>

    <ArticleSearch v-model="search" />

    <div class="overflow-x-auto">
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
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden space-y-4">
        <ArticleCard
          v-for="article in pagedArticles"
          :key="article.id"
          :article="article"
          @update:active="(v)=>setActive(article, v)"
          @share="() => {}"
          @edit="() => {}"
          @delete="() => {}"
          @pin="() => {}"
        />
      </div>
    </div>

    <ArticleFooter :total="pagedArticles.length" v-model:pageSize="pageSize" />
  </div>
</template>
