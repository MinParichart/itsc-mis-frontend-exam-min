<script setup lang="ts">
const props = defineProps<{ active: boolean; pinned? : boolean }>()
const emit  = defineEmits<{
  'update:active':[boolean],
  share:[], edit:[], delete:[], pin:[]
}>()
</script>

<template>
  <!-- คอนเทนเนอร์หลัก: เรียงแนวตั้งและชิดขวา -->
  <div class="flex flex-col items-end gap-2">
    <!-- แถวบน: Pin + Toggle + สถานะ -->
    <div class="flex items-center gap-2">
      <!-- ปักหมุด -->
      <button
        :class="props.pinned
        ? 'p-2 rounded bg-blue-500 text-white hover:bg-blue-600'
        : 'p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200'"
        :aria-pressed="props.pinned ? 'true' : 'false'"
        title="ปักหมุด"
        @click="$emit('pin')"
      >
        📌
      </button>

      <!-- Toggle + สถานะ -->
      <label class="flex items-center cursor-pointer gap-2">
        <input
          type="checkbox"
          class="hidden"
          :checked="props.active"
          @change="$emit('update:active', !props.active)"
        />
        <div
          class="w-10 h-5 rounded-full relative transition-colors"
          :class="props.active ? 'bg-blue-500' : 'bg-gray-300'"
        >
          <div
            class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
            :class="{ 'translate-x-5': active }"
          />
        </div>
        <span class="text-sm font-medium" :class="props.active ? 'text-green-600' : 'text-gray-500'">
          {{ active ? 'เผยแพร่' : 'ซ่อน' }}
        </span>
      </label>
    </div>

    <!-- แถวล่าง: Share / Edit / Delete -->
    <div class="flex items-center gap-2">
      <button
        class="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
        title="แชร์"
        @click="$emit('share')"
      >
        📤
      </button>

      <button
        class="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
        title="แก้ไข"
        @click="$emit('edit')"
      >
        ✏️
      </button>

      <!-- แสดงเสมอ แต่ปิดการกดเมื่อยังเผยแพร่ -->
      <button
        :disabled="active"
        class="p-2 rounded transition-colors"
        :class="active
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-red-100 text-red-600 hover:bg-red-200'"
        :title="active ? 'ต้องซ่อนก่อนจึงจะลบได้' : 'ลบ'"
        @click="!active && $emit('delete')"
      >🗑</button>
    </div>
  </div>
</template>
