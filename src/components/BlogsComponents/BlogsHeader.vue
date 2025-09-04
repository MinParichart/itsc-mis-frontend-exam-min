<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-2">
      <!-- แสดงความว่า บทความ หน้า BlogList -->
      <h2 class="text-lg font-bold">บทความ</h2>

      <!-- เปลี่ยน button เป็น RouterLink  -->
      <RouterLink
        :to="{ name: 'blogs-create' }"
        class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
      >
        <span>+ เพิ่มบทความใหม่</span>
      </RouterLink>
    </div>

    <!-- toggle แสดงทั้งหมด จะถูกส่งเข้ามาทาง slot -->
    <slot />
  </div>
</template>
