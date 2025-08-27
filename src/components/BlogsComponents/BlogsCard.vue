<script setup lang="ts">
import BlogsActions from './BlogsActions.vue'

interface Blogs {
  id: number
  title: string
  date: string
  thumbnail?: string
  active: boolean
  pinned? : boolean
}
const props = defineProps<{ blog : Blogs ;}>()
const emit  = defineEmits<{
  'update:active':[boolean],
  share:[], edit:[], delete:[], pin:[]
}>()
</script>

<template>
  <div class="border rounded-lg p-3 bg-white shadow-sm">
    <div class="flex items-start gap-3">
      <input type="checkbox" class="mt-2" />
      <img
        v-if="props.blog.thumbnail"
        :src="props.blog.thumbnail"
        alt="thumb"
        class="w-16 h-16 rounded object-cover"
      />
      <div class="flex-1 min-w-0">
        <p class="font-bold text-gray-700 truncate">{{ props.blog.title }}</p>
        <p class="text-sm text-gray-500">📆 {{ props.blog.date }}</p>
      </div>
    </div>

    <div class="mt-3">
      <BlogsActions
        :active="props.blog.active"
        :pinned="(props as any).blog.pin"
        @update:active="(v)=>emit('update:active', v)"
        @share="emit('share')"
        @edit="emit('edit')"
        @delete="emit('delete')"
        @pin="emit('pin')"
      />
    </div>
  </div>
</template>
