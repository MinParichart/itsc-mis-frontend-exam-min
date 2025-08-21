<script setup lang="ts">
import BlogsActions from './BlogsActions.vue'

interface Blogs {
  id: number
  title: string
  date: string
  thumbnail?: string
  active: boolean
}

const props = defineProps<{ blog : Blogs }>()
const emit  = defineEmits<{
  'update:active':[boolean],
  share:[], edit:[], delete:[], pin:[]
}>()
</script>

<template>
  <tr class="border-b border-gray-200 hover:bg-gray-50 text-sm">
    <!-- checkbox -->
    <td class="p-2"><input type="checkbox" /></td>

    <!-- content -->
    <td class="p-2 flex items-start gap-3 min-w-[280px]">
      <img
        v-if="props.blog.thumbnail"
        :src="props.blog.thumbnail"
        alt="thumb"
        class="w-12 h-12 md:w-16 md:h-16 rounded object-cover"
      />
      <div class="flex flex-col min-w-0">
        <span class="font-bold truncate max-w-[200px] sm:max-w-[320px] md:max-w-[480px] text-gray-600">
          {{ props.blog.title }}
        </span>
        <span class="text-sm text-gray-500">📆 {{ props.blog.date }}</span>
      </div>
    </td>

    <!-- actions -->
    <td class="p-2">
      <BlogsActions
        :active="props.blog.active"
        @update:active="(v)=>emit('update:active', v)"
        @share="emit('share')"
        @edit="emit('edit')"
        @delete="emit('delete')"
        @pin="emit('pin')"
      />
    </td>
  </tr>
</template>
