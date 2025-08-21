<script setup lang="ts">
import ArticleActions from './ArticleActions.vue'

interface Article {
  id: number
  title: string
  date: string
  thumbnail?: string
  active: boolean
}

const props = defineProps<{ article: Article }>()
const emit  = defineEmits<{
  'update:active':[boolean],
  share:[], edit:[], delete:[], pin:[]
}>()
</script>

<template>
  <tr class="border-b border-gray-200 hover:bg-gray-50 text-sm">
    <!-- checkbox -->
    <td class="p-2">
      <input type="checkbox" />
    </td>

    <!-- content -->
    <td class="p-2 flex items-start space-x-3">
      <img
        v-if="props.article.thumbnail"
        :src="props.article.thumbnail"
        alt="thumb"
        class="w-[72px] h-[72px] rounded object-cover items-center"
      />
      <div class="flex flex-col">
        <span class="font-bold truncate max-w-[220px] text-gray-500">
          {{ props.article.title }}
        </span>
        <span class="text-sm text-gray-500">📆 {{ props.article.date }}</span>
      </div>
    </td>

    <!-- actions -->
    <td class="p-2">
      <ArticleActions
        :active="props.article.active"
        @update:active="(v)=>emit('update:active', v)"
        @share="emit('share')"
        @edit="emit('edit')"
        @delete="emit('delete')"
        @pin="emit('pin')"
      />
    </td>
  </tr>
</template>
