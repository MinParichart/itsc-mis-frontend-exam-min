<script setup lang="ts">
import BlogsActions from './BlogsActions.vue'
import type { Blog } from '@/models/blog'

const props = defineProps<{ blog: Blog; selected?: boolean }>()
const emit = defineEmits<{
  'update:active': [boolean]
  view: []
  edit: []
  delete: []
  pin: []
  'toggle-select': [boolean]
}>()

const fallback = 'https://placehold.co/64x64?text=No+Img'
const onImgErr = (e: Event) => {
  (e.target as HTMLImageElement).src = fallback
}
</script>

<template>
  <tr class="border-b border-gray-200 hover:bg-gray-50 text-sm">
    <td class="p-2">
      <input
        type="checkbox"
        :checked="!props.blog.active && props.selected"
        :disabled="props.blog.active"
        :title="props.blog.active ? 'ต้องซ่อนก่อนถึงจะเลือกเพื่อลบได้' : 'เลือกเพื่อลบ'"
        @click.stop
        @change="emit('toggle-select', ($event.target as HTMLInputElement).checked)"
      />
    </td>

    <td class="p-2">
      <div class="flex items-start gap-3 min-w-[280px]">
        <img
          :src="props.blog.thumbnail || fallback"
          alt="thumb"
          class="w-16 h-16 rounded object-cover cursor-pointer"
          @error="onImgErr"
          @click="emit('view')"
        />
        <div class="flex-1 min-w-0">
          <p class="font-bold text-gray-700 truncate cursor-pointer" @click="emit('view')">
            {{ props.blog.title }}
          </p>
          <p class="text-sm text-gray-500">📆 {{ props.blog.date }}</p>
        </div>
      </div>
    </td>

    <td class="p-2">
      <BlogsActions
        :active="props.blog.active"
        :pin="props.blog.pin"
        @update:active="(v) => emit('update:active', v)"
        @view="emit('view')"
        @edit="emit('edit')"
        @delete="emit('delete')"
        @pin="emit('pin')"
      />
    </td>
  </tr>
</template>
