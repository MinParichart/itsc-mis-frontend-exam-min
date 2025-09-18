<script setup lang="ts">
import type { Blog } from '@/models/blog'; // import type Blog เพื่อกำหนดชนิดข้อมูล props.blog
import BlogsActions from './BlogsActions.vue'; // import component ลูกที่รวมปุ่ม action (view/edit/delete/pin/toggle)

// 📌 defineProps = รับข้อมูลจาก parent component
// blog = object ที่มีข้อมูล blog 1 อัน (title, date, active, pin, thumbnail ...)
// selected = ใช้กับ checkbox (ถูกเลือกไว้หรือยัง) เป็น optional ไม่ส่งมาก็ได้
const props = defineProps<{ blog: Blog; selected?: boolean }>()

// 📌 defineEmits = ประกาศ event ที่ component นี้สามารถส่งออกไปให้ parent ได้
const emit = defineEmits<{
  'update:active': [boolean] // ส่งออกเมื่อกด toggle active (เผยแพร่/ซ่อน)
  view: []                   // ส่งออกเมื่อกดปุ่ม view
  edit: []                   // ส่งออกเมื่อกดปุ่ม edit
  delete: []                 // ส่งออกเมื่อกดปุ่ม delete
  pin: []                    // ส่งออกเมื่อกดปุ่ม pin
  'toggle-select': [boolean] // ส่งออกเมื่อกด checkbox เลือกเพื่อลบ
}>()

// 📌 fallback รูป dummy เผื่อกรณี blog ไม่มีรูป thumbnail
const fallback = 'https://placehold.co/64x64?text=No+Img'

// 📌 onImgErr = ถ้ารูปโหลดไม่ขึ้น → เปลี่ยนเป็น fallback
const onImgErr = (e: Event) => {
  (e.target as HTMLImageElement).src = fallback
}
</script>

<template>
  <!-- กล่องใหญ่ครอบ blog item -->
  <div class="border rounded-lg p-3 bg-white shadow-sm">
    <div class="flex items-start gap-3">
      <!-- Checkbox เลือก blog (เลือกได้เฉพาะ blog ที่ inactive/ซ่อนอยู่) -->
      <input type="checkbox" class="mt-2" :checked="!props.blog.active && props.selected" :disabled="props.blog.active"
        :title="props.blog.active ? 'ต้องซ่อนก่อนถึงจะเลือกเพื่อลบได้' : 'เลือกเพื่อลบ'" @click.stop
        @change="emit('toggle-select', ($event.target as HTMLInputElement).checked)" />

      <!-- Thumbnail รูป blog -->
      <!-- ถ้ารูป error → ใช้ fallback -->
      <!-- คลิกที่รูป → เปิดดูรายละเอียด -->
      <img :src="props.blog.thumbnail || fallback" alt="thumb" class="w-16 h-16 rounded object-cover cursor-pointer"
        @error="onImgErr" @click="emit('view')" />

      <!-- ข้อมูล Title + Date -->
      <div class="flex-1 min-w-0">
        <!-- Title (คลิกได้ → emit view) -->
        <p class="font-bold text-gray-700 truncate cursor-pointer" @click="emit('view')">
          {{ props.blog.title }}
        </p>
        <!-- วันที่ -->
        <p class="text-sm text-gray-500">📆 {{ props.blog.date }}</p>
      </div>
    </div>

    <!-- ส่วนปุ่ม action (reuse จาก BlogsActions.vue) -->
    <div class="mt-3">
      <BlogsActions :active="props.blog.active" :pin="props.blog.pin" @update:active="(v) => emit('update:active', v)"
        @view="emit('view')" @edit="emit('edit')" @delete="emit('delete')" @pin="emit('pin')" />
    </div>
  </div>
</template>
