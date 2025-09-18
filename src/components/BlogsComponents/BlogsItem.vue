<script setup lang="ts">
import type { Blog } from '@/models/blog'; // type Blog (โครงสร้างข้อมูลของ blog)
import BlogsActions from './BlogsActions.vue'; // component ปุ่มจัดการ (ดู/แก้ไข/ลบ/ปักหมุด)

// props = ข้อมูลที่รับมาจาก parent component
const props = defineProps<{
  blog: Blog;           // blog 1 รายการ (title, content, date, active, ฯลฯ)
  selected?: boolean;   // ใช้บอกว่า checkbox ถูกเลือกหรือยัง (ไม่บังคับส่ง)
}>()

// emit = event ที่ส่งออกไปให้ parent component
const emit = defineEmits<{
  'update:active': [boolean] // toggle สถานะ เผยแพร่/ซ่อน
  view: []                   // ดูรายละเอียด
  edit: []                   // แก้ไข
  delete: []                 // ลบ
  pin: []                    // ปักหมุด
  'toggle-select': [boolean] // เลือก/ไม่เลือก checkbox
}>()

// fallback = รูปแทนถ้าไม่มีรูปจริง
const fallback = 'https://placehold.co/64x64?text=No+Img'

// ฟังก์ชันกันรูปพัง: ถ้าโหลดรูป blog ไม่ได้ → แทนที่ด้วย fallback
const onImgErr = (e: Event) => {
  (e.target as HTMLImageElement).src = fallback
}
</script>

<template>
  <!-- แสดง blog 1 รายการในรูปแบบตาราง (row = <tr>) -->
  <tr class="border-b border-gray-200 hover:bg-gray-50 text-sm">

    <!-- คอลัมน์ที่ 1: checkbox -->
    <td class="p-2">
      <!-- เลือกได้เฉพาะ blog ที่ถูก "ซ่อน" -->
      <!-- stop = กัน event bubble ไปถึง parent -->
      <input type="checkbox" :checked="!props.blog.active && props.selected" :disabled="props.blog.active"
        :title="props.blog.active ? 'ต้องซ่อนก่อนถึงจะเลือกเพื่อลบได้' : 'เลือกเพื่อลบ'" @click.stop
        @change="emit('toggle-select', ($event.target as HTMLInputElement).checked)" />
    </td>

    <!-- คอลัมน์ที่ 2: ข้อมูล blog (thumbnail + title + date) -->
    <td class="p-2">
      <div class="flex items-start gap-3 min-w-[280px]">
        <!-- รูปภาพ -->
        <!-- ถ้ารูปโหลดไม่ขึ้น → แสดง fallback -->
        <!-- คลิกที่รูป → เปิดดูรายละเอียด -->
        <img :src="props.blog.thumbnail || fallback" alt="thumb" class="w-16 h-16 rounded object-cover cursor-pointer"
          @error="onImgErr" @click="emit('view')" />

        <!-- ชื่อ + วันที่ -->
        <div class="flex-1 min-w-0">
          <p class="font-bold text-gray-700 truncate cursor-pointer" @click="emit('view')">
            {{ props.blog.title }}
          </p>
          <p class="text-sm text-gray-500">📆 {{ props.blog.date }}</p>
        </div>
      </div>
    </td>

    <!-- คอลัมน์ที่ 3: ปุ่มจัดการ (จาก BlogsActions.vue) -->
    <td class="p-2">
      <BlogsActions :active="props.blog.active" :pin="props.blog.pin" @update:active="(v) => emit('update:active', v)"
        @view="emit('view')" @edit="emit('edit')" @delete="emit('delete')" @pin="emit('pin')" />
    </td>
  </tr>
</template>
