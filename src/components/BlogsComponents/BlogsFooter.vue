<script setup lang="ts">
const props = defineProps<{ total: number; pageSize: number }>()
const emit  = defineEmits<{ 'update:pageSize':[number] }>()
</script>

<template>
  <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
    <span>แสดง {{ total }} รายการ</span>
    <div class="flex items-center space-x-2 ml-auto">
      <span>จำนวนต่อหน้า</span>
      <select
        :value="pageSize"
        @change="emit('update:pageSize', +($event.target as HTMLSelectElement).value)"
        class="border rounded px-2 py-1"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
      </select>
    </div>
  </div>
</template>
