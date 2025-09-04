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

// รับสถานะ selected จากพาเรนต์ด้วย
const props = defineProps<{ blog: Blogs; selected?: boolean }>();
// เพิ่มอีเวนต์ toggle-select
const emit = defineEmits<{
  "update:active": [boolean];
  view: [];
  edit: [];
  delete: [];
  pin: [];
  "toggle-select": [boolean];
}>();

// รูป fallback กันเคสไม่มีรูป/โหลดพัง
const fallback = "https://placehold.co/64x64?text=No+Img";
const onImgErr = (e: Event) => {
  (e.target as HTMLImageElement).src = fallback;
};
</script>

<template>
  <tr class="border-b border-gray-200 hover:bg-gray-50 text-sm">
    <!-- checkbox -->
    <td class="p-2">
      <input
        type="checkbox"
        :checked="props.selected"
        @change="
          emit('toggle-select', ($event.target as HTMLInputElement).checked)
        "
      />
    </td>

    <!-- content -->
    <td class="p-2">
      <div class="flex items-start gap-3 min-w-[280px]">
        <!-- คลิกรูปแล้วไป /blogs/:id -->
        <RouterLink
          :to="{ name: 'blogs_id', params: { id: props.blog.id } }"
          class="shrink-0"
          aria-label="เปิดบทความ"
        >
          <img
            :src="props.blog.thumbnail || fallback"
            alt="thumbnail"
            class="w-12 h-12 md:w-16 md:h-16 rounded object-cover"
            loading="lazy"
            @error="onImgErr"
          />
        </RouterLink>

        <div class="flex flex-col min-w-0">
          <!-- คลิกหัวข้อแล้วไป /blogs/:id -->
          <RouterLink
            :to="{ name: 'blogs_id', params: { id: props.blog.id } }"
            class="font-bold truncate max-w-[200px] sm:max-w-[320px] md:max-w-[480px] text-gray-600 hover:underline"
          >
            {{ props.blog.title }}
          </RouterLink>
          <span class="text-sm text-gray-500">📆 {{ props.blog.date }}</span>
        </div>
      </div>
    </td>

    <!-- actions -->
    <td class="p-2">
      <BlogsActions
        :active="props.blog.active"
        :pin="props.blog.pin ?? false"
        @update:active="(v) => emit('update:active', v)"
        @view="emit('view')"
        @edit="emit('edit')"
        @delete="emit('delete')"
        @pin="emit('pin')"
      />
    </td>
  </tr>
</template>
