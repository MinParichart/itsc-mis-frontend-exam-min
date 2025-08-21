<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-2">
      <h2 class="text-lg font-bold">บทความ</h2>
      <button class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
        <span>+ เพิ่มบทความใหม่</span>
      </button>
    </div>
    <!-- รับ toggle ผ่าน slot -->
    <slot />
  </div>
</template>
