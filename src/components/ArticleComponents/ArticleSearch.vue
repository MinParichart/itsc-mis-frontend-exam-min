<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <div class="mb-4">
    <input
      v-model="model"
      type="text"
      placeholder="ค้นหาเรื่อง, เนื้อหา"
      class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
</template>
