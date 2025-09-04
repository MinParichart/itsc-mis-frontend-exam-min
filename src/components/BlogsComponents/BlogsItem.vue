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

/* CHANGE 8: รับ selected จากพาเรนต์ */
const props = defineProps<{ blog: Blogs; selected?: boolean }>();
/* /CHANGE 8 */

/* CHANGE 9: เพิ่มอีเวนต์ toggle-select */
const emit = defineEmits<{
  "update:active": [boolean];
  share: [];
  edit: [];
  delete: [];
  pin: [];
  "toggle-select": [boolean];
}>();
/* /CHANGE 9 */
</script>

<template>
  <tr class="border-b border-gray-200 hover:bg-gray-50 text-sm">
    <td class="p-2">
      <!-- CHANGE 10: disable เมื่อเผยแพร่ และบังคับไม่ให้เช็ค -->
      <input
        type="checkbox"
        :checked="!props.blog.active && props.selected"
        :disabled="props.blog.active"
        :title="
          props.blog.active
            ? 'ต้องซ่อนก่อนถึงจะเลือกเพื่อลบได้'
            : 'เลือกเพื่อลบ'
        "
        @change="
          emit('toggle-select', ($event.target as HTMLInputElement).checked)
        "
      />
      <!-- /CHANGE 10 -->
    </td>

    <td class="p-2">
      <div class="flex items-start gap-3 min-w-[280px]">
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
    </td>

    <td class="p-2">
      <BlogsActions
        :active="props.blog.active"
        :pin="props.blog.pin"
        @update:active="(v) => emit('update:active', v)"
        @share="emit('share')"
        @edit="emit('edit')"
        @delete="emit('delete')"
        @pin="emit('pin')"
      />
    </td>
  </tr>
</template>
