<script setup lang="ts">
import BlogsActions from "./BlogsActions.vue";

interface Blogs {
  id: number;
  title: string;
  date: string;
  thumbnail?: string;
  active: boolean;
  pin?: boolean;
}

/* CHANGE 11: รับ selected จากพาเรนต์ */
const props = defineProps<{ blog: Blogs; selected?: boolean }>();
/* /CHANGE 11 */

const emit = defineEmits<{
  "update:active": [boolean];
  view: [];
  edit: [];
  delete: [];
  pin: [];
  /* CHANGE 12: แจ้งพาเรนต์เมื่อติ๊ก/ยกเลิกติ๊ก */
  "toggle-select": [boolean];
}>();
/* /CHANGE 12 */

const fallback = "https://placehold.co/64x64?text=No+Img";
const onImgErr = (e: Event) => {
  (e.target as HTMLImageElement).src = fallback;
};
</script>

<template>
  <div class="border rounded-lg p-3 bg-white shadow-sm">
    <div class="flex items-start gap-3">
      <!-- checkbox -->
      <input
        type="checkbox"
        class="mt-2"
        :checked="!props.blog.active && props.selected"
        :disabled="props.blog.active"
        :title="props.blog.active ? 'ต้องซ่อนก่อนถึงจะเลือกเพื่อลบได้' : 'เลือกเพื่อลบ'"
        @click.stop
        @change="emit('toggle-select', ($event.target as HTMLInputElement).checked)"
      />

      <!-- รูป: คลิกแล้ว emit('view') -->
      <img
        :src="props.blog.thumbnail || fallback"
        alt="thumb"
        class="w-16 h-16 rounded object-cover cursor-pointer"
        @error="onImgErr"
        @click="emit('view')"
      />

      <div class="flex-1 min-w-0">
        <!-- ชื่อ: คลิกแล้ว emit('view') -->
        <p
          class="font-bold text-gray-700 truncate cursor-pointer"
          @click="emit('view')"
        >
          {{ props.blog.title }}
        </p>
        <p class="text-sm text-gray-500">📆 {{ props.blog.date }}</p>
      </div>
    </div>

    <div class="mt-3">
      <BlogsActions
        :active="props.blog.active"
        :pin="props.blog.pin"
        @update:active="(v) => emit('update:active', v)"
        @view="emit('view')"
        @edit="emit('edit')"
        @delete="emit('delete')"
        @pin="emit('pin')"
      />
    </div>
  </div>
</template>
