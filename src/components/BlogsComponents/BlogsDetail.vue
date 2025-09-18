<script setup lang="ts">
// import icon ปากกาแก้ไขจาก heroicons
import { PencilSquareIcon } from "@heroicons/vue/24/solid";

// import type Blog (ใช้บอกโครงสร้างข้อมูลบทความ)
import type { Blog } from '@/models/blog';

// defineProps → ใช้รับค่าที่ส่งมาจาก parent component
// blog: Blog → parent จะส่ง object ที่เป็นข้อมูลบทความมา เช่น { id, title, content, date, active, thumbnail }
const props = defineProps<{ blog: Blog }>();

// fallback → ถ้าไม่มีรูป / รูปโหลดไม่ขึ้น จะใช้ URL นี้แทน
const fallback = "https://placehold.co/640x360?text=No+Image";

// onErr → ฟังก์ชันเปลี่ยนรูปเป็น fallback เวลาโหลดรูปพัง
const onErr = (e: Event) => ((e.target as HTMLImageElement).src = fallback);
</script>

<template>
  <!-- กล่องหลักของการ์ดบทความ -->
  <div class="bg-white rounded-xl border border-gray-200 shadow">

    <!-- Header ส่วนบน -->
    <div class="px-6 py-4 flex items-start justify-between gap-4">

      <!-- ซ้าย: ข้อมูล title + วันที่ -->
      <div class="min-w-0">
        <!-- ชื่อบทความ -->
        <h1 class="text-xl font-semibold leading-snug text-gray-800 truncate">
          {{ props.blog.title }}
        </h1>
        <!-- วันที่ -->
        <p class="text-sm text-gray-500 mt-1">📅 {{ props.blog.date }}</p>
      </div>

      <!-- ขวา: สถานะ + ปุ่มแก้ไข -->
      <div class="flex items-center gap-4 shrink-0">

        <!-- สถานะบทความ -->
        <div class="text-sm text-gray-600">
          <span class="mr-1">สถานะ:</span>
          <!-- ถ้า active=true → แสดงเผยแพร่ (สีเขียว) / ถ้า false → ซ่อน (สีเทา) -->
          <span :class="props.blog.active ? 'text-green-600 font-medium' : 'text-gray-400'">
            {{ props.blog.active ? "เผยแพร่" : "ซ่อน" }}
          </span>
        </div>

        <!-- ปุ่มแก้ไข → ใช้ RouterLink เพื่อไปหน้า blogs-update -->
        <RouterLink :to="{ name: 'blogs-update', params: { id: String(props.blog.id) } }"
          class="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200" title="แก้ไขบทความ">
          <PencilSquareIcon class="w-4 h-4" />
        </RouterLink>
      </div>
    </div>

    <!-- Body ส่วนเนื้อหา -->
    <div class="px-6 py-6">

      <!-- แสดงรูป (ถ้ามี thumbnail) -->
      <!-- ถ้ารูปพัง → เรียก fallback -->
      <img v-if="props.blog.thumbnail" :src="props.blog.thumbnail" alt=""
        class="mx-auto mb-6 max-h-72 object-contain rounded" @error="onErr" />

      <!-- เส้นคั่น -->
      <hr class="border-t border-gray-200 my-4" />

      <!-- เนื้อหาบทความ -->
      <p class="whitespace-pre-line leading-7 text-gray-700">
        {{ props.blog.content || "" }}
      </p>
    </div>
  </div>
</template>
