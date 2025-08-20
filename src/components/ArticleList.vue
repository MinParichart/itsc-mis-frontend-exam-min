<script setup lang="ts">
import { computed, ref, watch } from "vue";

// กำหนด type ของบทความ
interface Article {
  id: number;
  title: string;
  date: string;
  thumbnail?: string;
  active: boolean;
}

const showAll = ref<boolean>(false);
const search = ref<string>("");
const pageSize = ref<number>(10);

const articles = ref<Article[]>([
  {
    id: 1,
    title: "Concert in Thailand",
    date: "10 ก.พ. 2567 08:15 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 2,
    title: "The Rose Music",
    date: "10 ก.พ. 2567 23:18 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: false,
  },
  {
    id: 3,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 4,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 5,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 6,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 7,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 8,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 9,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 10,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 11,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
  {
    id: 12,
    title: "Be cool in the rain The Flooding is coming. Be safe! everyone can do",
    date: "10 ก.พ. 2567 21:00 น.",
    thumbnail: "https://shorturl.asia/ntaxE",
    active: true,
  },
]);

// filter ด้วย computed
const filteredArticles = computed<Article[]>(() =>
  articles.value
    .filter((a) => a.title.toLowerCase().includes(search.value.toLowerCase()))
    .slice(0, pageSize.value)
);

const toggleAll = () => {
  articles.value.forEach(a => {
    a.active = showAll.value;
  });
};

watch(showAll, (newVal) => {
  articles.value.forEach((a) => (a.active = newVal));
});

</script>

<template>
  <div class="container mx-auto shadow rounded-lg p-4 my-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <h2 class="text-lg font-bold">บทความ</h2>
        <button class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
          <span>+ เพิ่มบทความใหม่</span>
        </button>
      </div>

      <!-- Toggle -->
      <div class="flex items-center">
        <label class="flex items-center space-x-2 cursor-pointer">
          <div class="w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer"
            :class="showAll ? 'bg-blue-500' : 'bg-gray-300'" @click="showAll = !showAll">
            <div
              class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
              :class="{ 'translate-x-5': showAll }"></div>
          </div>
          <span class="text-sm">แสดงทั้งหมด</span>
        </label>
      </div>
    </div>
    <!-- Search -->
    <div class="mb-4">
      <input v-model="search" type="text" placeholder="ค้นหาเรื่อง, เนื้อหา"
        class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>

    <!-- Table Responsive -->
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
          <tr v-for="article in filteredArticles" :key="article.id"
            class="border-b border-gray-200 hover:bg-gray-50 text-sm">
            <!-- checkbox -->
            <td class="p-2">
              <input type="checkbox" />
            </td>

            <!-- ข้อมูลบทความ -->
            <td class="p-2 flex items-start space-x-3">
              <img v-if="article.thumbnail" :src="article.thumbnail" alt="thumb"
                class="w-18 h-18 rounded object-cover items-center" />
              <div class="flex flex-col">
                <span class="font-bold truncate max-w-[220px] text-gray-500">
                  {{ article.title }}
                </span>
                <span class="text-sm text-gray-500">📆 {{ article.date }}</span>
              </div>
            </td>

            <!-- การจัดการ -->
            <!-- การจัดการ -->
            <td class="p-2">
              <div class="flex flex-col items-end space-y-2">
                <!-- แถวบน: Pin + Toggle + สถานะ -->
                <div class="flex items-center space-x-2">
                  <!-- Pin -->
                  <button class="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="ปักหมุด">
                    📌
                  </button>

                  <!-- Toggle -->
                  <label class="flex items-center cursor-pointer space-x-1">
                    <input type="checkbox" class="hidden" v-model="article.active" />
                    <div class="w-10 h-5 rounded-full relative transition"
                      :class="article.active ? 'bg-blue-500' : 'bg-gray-300'">
                      <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition"
                        :class="{ 'translate-x-5': article.active }"></div>
                    </div>
                    <span class="text-sm font-medium" :class="article.active ? 'text-green-600' : 'text-gray-500'">
                      {{ article.active ? 'เผยแพร่' : 'ซ่อน' }}
                    </span>
                  </label>
                </div>

                <!-- แถวล่าง: Share, Edit, Delete -->
                <div class="flex items-center space-x-2">
                  <!-- Share -->
                  <button class="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" title="แชร์">
                    📤
                  </button>

                  <!-- Edit -->
                  <button class="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200" title="แก้ไข">
                    ✏️
                  </button>

                  <!-- Delete (แสดงเฉพาะตอน active = false) -->
                  <button v-if="!article.active" class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    title="ลบ">
                    🗑
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Card Layout -->
      <div class="md:hidden space-y-4">
        <div v-for="article in filteredArticles" :key="article.id" class="border rounded-lg p-3 bg-white shadow-sm">
          <div class="flex items-start space-x-3">
            <input type="checkbox" class="mt-2" />
            <img v-if="article.thumbnail" :src="article.thumbnail" alt="thumb" class="w-16 h-16 rounded object-cover" />
            <div class="flex flex-col flex-1">
              <span class="font-bold text-gray-700">
                {{ article.title }}
              </span>
              <span class="text-sm text-gray-500">📆 {{ article.date }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col items-end mt-3 space-y-2">
            <div class="flex items-center space-x-2">
              <button class="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="ปักหมุด">
                📌
              </button>
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" class="hidden" v-model="article.active" />
                <div class="w-10 h-5 bg-gray-300 rounded-full relative transition"
                  :class="{ 'bg-blue-500': article.active }">
                  <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition"
                    :class="{ 'translate-x-5': article.active }"></div>
                </div>
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <button class="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" title="แชร์">
                📤
              </button>
              <button class="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200" title="แก้ไข">
                ✏️
              </button>
              <button class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200" title="ลบ">
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
      <span>แสดง {{ filteredArticles.length }} รายการ</span>
      <div class="felx items-center space-x-2 ml-auto">
        <span class="justify-items-end">จำนวนต่อหน้า</span>
        <select v-model="pageSize" class="border rounded px-2 py-1">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </div>
    </div>
  </div>
</template>
