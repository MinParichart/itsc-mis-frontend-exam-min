<script setup lang="ts">
// นำปุ่ม action มาใช้ pin/toogle/active/edit/delete
import BlogsActions from './BlogsActions.vue'

// ประกาศชนิดข้อมูลของบล็อกที่คอมโพเนนต์นี้ “คาดหวัง” จะได้รับผ่าน props
interface Blogs {
  id: number
  title: string
  date: string
  thumbnail?: string
  active: boolean
  pin?: boolean
}

// กำหนดชนิดของพร็อพที่ component นี้ “รับเข้ามา” จากพาเรนต์
// บอกว่า parent จะส่งวัตถุ blog (ชนิด Blogs) เข้ามาเป็นพร็อพเดียว
const props = defineProps<{ blog: Blogs; }>()

// กำหนดอีเวนต์ที่คอมโพเนนต์นี้จะยิงขึ้นไปให้พาเรนต์ เช่น เวลากด pin / edit / delete
const emit = defineEmits<{
  'update:active': [boolean],
  share: [],
  edit: [],
  delete: [],
  pin: []
}>()
</script>

<template>
  <div class="border rounded-lg p-3 bg-white shadow-sm">
    <div class="flex items-start gap-3">
      <input type="checkbox" class="mt-2" />
      <img v-if="props.blog.thumbnail" :src="props.blog.thumbnail" alt="thumb" class="w-16 h-16 rounded object-cover" />
      <div class="flex-1 min-w-0">
        <p class="font-bold text-gray-700 truncate">{{ props.blog.title }}</p>
        <p class="text-sm text-gray-500">📆 {{ props.blog.date }}</p>
      </div>
    </div>

    <div class="mt-3">
      <BlogsActions 
      :active="props.blog.active" 
      :pin="props.blog.pin"
      @update:active="(v) => emit('update:active', v)" 
      @share="emit('share')" @edit="emit('edit')"
      @delete="emit('delete')" @pin="emit('pin')" />
    </div>
  </div>
</template>
