<script setup lang="ts">
interface Blog {
  id: number
  title: string
  date: string
  active: boolean
  thumbnail?: string
  content?: string
}
const props = defineProps<{ blog: Blog }>()
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <!-- Header -->
    <div class="px-6 py-4 border-b flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold leading-snug text-gray-800">
          {{ blog.title }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">📅 {{ blog.date }}</p>
      </div>

      <div class="text-sm text-gray-600 shrink-0">
        <span class="mr-1">สถานะ:</span>
        <span :class="blog.active ? 'text-green-600 font-medium' : 'text-gray-400'">
          {{ blog.active ? 'เผยแพร่' : 'ซ่อน' }}
        </span>
      </div>
    </div>

    <!-- Body -->
    <div class="px-6 py-6">
      <img
        v-if="blog.thumbnail"
        :src="blog.thumbnail"
        alt=""
        class="mx-auto mb-6 max-h-72 object-contain rounded"
      />
      <p class="whitespace-pre-line leading-7 text-gray-700">
        {{ blog.content || '' }}
      </p>
    </div>
  </div>
</template>
