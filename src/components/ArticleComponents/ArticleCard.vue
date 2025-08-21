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
  <div class="border rounded-lg p-3 bg-white shadow-sm">
    <div class="flex items-start gap-3">
      <input type="checkbox" class="mt-2" />
      <img
        v-if="props.article.thumbnail"
        :src="props.article.thumbnail"
        alt="thumb"
        class="w-16 h-16 rounded object-cover"
      />
      <div class="flex-1 min-w-0">
        <p class="font-bold text-gray-700 truncate">{{ props.article.title }}</p>
        <p class="text-sm text-gray-500">📆 {{ props.article.date }}</p>
      </div>
    </div>

    <div class="mt-3">
      <ArticleActions
        :active="props.article.active"
        @update:active="(v)=>emit('update:active', v)"
        @share="emit('share')"
        @edit="emit('edit')"
        @delete="emit('delete')"
        @pin="emit('pin')"
      />
    </div>
  </div>
</template>
