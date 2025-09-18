<template>
  <!-- container หลัก จัด layout ให้หัวข้อกับปุ่ม -->
  <div class="flex items-center justify-between mb-4">

    <!-- ส่วนซ้าย: แสดงหัวข้อ + ปุ่มเพิ่ม -->
    <div class="flex items-center space-x-2">
      <!-- ข้อความหัวข้อ -->
      <h2 class="text-lg font-bold">บทความ</h2>

      <!-- ปุ่ม "เพิ่มบทความใหม่" -->
      <!-- ใช้ RouterLink แทน button → เวลา click จะเปลี่ยนหน้าไป blogs-create -->
      <RouterLink :to="{ name: 'blogs-create' }"
        class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
        <span>+ เพิ่มบทความใหม่</span>
      </RouterLink>
    </div>

    <!-- ส่วนขวา: เว้นไว้ให้ parent ส่ง element เข้ามาทาง slot -->
    <!-- เช่น ปุ่ม toggle แสดง "ทั้งหมด/ที่ซ่อน" -->
    <slot />
  </div>
</template>
