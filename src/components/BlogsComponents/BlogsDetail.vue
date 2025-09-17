<script setup lang="ts">
import { PencilSquareIcon } from "@heroicons/vue/24/solid";

import type { Blog } from '@/models/blog';
const props = defineProps<{ blog: Blog }>();

// กันรูปพัง/ไม่มีรูป
const fallback = "https://placehold.co/640x360?text=No+Image";
const onErr = (e: Event) => ((e.target as HTMLImageElement).src = fallback);
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow">
    <!-- Header -->
    <div class="px-6 py-4 flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-xl font-semibold leading-snug text-gray-800 truncate">
          {{ props.blog.title }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">📅 {{ props.blog.date }}</p>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <div class="text-sm text-gray-600">
          <span class="mr-1">สถานะ:</span>
          <span :class="props.blog.active ? 'text-green-600 font-medium' : 'text-gray-400'
            ">
            {{ props.blog.active ? "เผยแพร่" : "ซ่อน" }}
          </span>
        </div>

        <RouterLink :to="{ name: 'blogs-update', params: { id: String(props.blog.id) } }"
          class="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200" title="แก้ไขบทความ">
          <PencilSquareIcon class="w-4 h-4" />
        </RouterLink>
      </div>
    </div>

    <!-- Body -->
    <div class="px-6 py-6">
      <img v-if="props.blog.thumbnail" :src="props.blog.thumbnail" alt=""
        class="mx-auto mb-6 max-h-72 object-contain rounded" @error="onErr" />
      <hr class="border-t border-gray-200 my-4" />
      <p class="whitespace-pre-line leading-7 text-gray-700">
        {{ props.blog.content || "" }}
      </p>
    </div>
  </div>
</template>
