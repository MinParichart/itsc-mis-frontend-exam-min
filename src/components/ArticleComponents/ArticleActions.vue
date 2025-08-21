<script setup lang="ts">
const props = defineProps<{ active: boolean }>()
const emit  = defineEmits<{
  'update:active':[boolean],
  share:[], edit:[], delete:[], pin:[]
}>()

const toggle = () => emit('update:active', !props.active)
</script>

<template>
  <div class="flex flex-col items-end space-y-2">
    <!-- บรรทัดบน: ปักหมุด + toggle + สถานะ -->
    <div class="flex items-center space-x-2">
      <button class="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="ปักหมุด" @click="$emit('pin')">
        📌
      </button>

      <label class="flex items-center cursor-pointer space-x-1">
        <input type="checkbox" class="hidden" :checked="active" @change="toggle" />
        <div class="w-10 h-5 rounded-full relative transition-colors"
             :class="active ? 'bg-blue-500' : 'bg-gray-300'">
          <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
               :class="{ 'translate-x-5': active }" />
        </div>
        <span class="text-sm font-medium" :class="active ? 'text-green-600' : 'text-gray-500'">
          {{ active ? 'เผยแพร่' : 'ซ่อน' }}
        </span>
      </label>
    </div>

    <!-- บรรทัดล่าง: ปุ่มอื่น -->
    <div class="flex items-center space-x-2">
      <button class="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" title="แชร์" @click="$emit('share')">
        📤
      </button>
      <button class="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200" title="แก้ไข" @click="$emit('edit')">
        ✏️
      </button>
      <button v-if="!active" class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200" title="ลบ" @click="$emit('delete')">
        🗑
      </button>
    </div>
  </div>
</template>
