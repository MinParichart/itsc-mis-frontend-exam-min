<!-- src/views/BlogsCreateView.vue -->
<script setup lang="ts">
import BlogsCreate from "@/components/BlogsComponents/BlogsCreate.vue";
// ↑ import component ฟอร์มสำหรับสร้างบทความใหม่ (BlogsCreate)

import NavbarForAll from "@/components/BlogsComponents/NavbarForAll.vue";
// ↑ import Navbar สำหรับทุกหน้า (มีปุ่ม logout ได้)
</script>

<template>
  <!-- เรียกใช้ NavbarForAll (ใส่ show-logout=true เพื่อโชว์ปุ่มออกจากระบบ) -->
  <NavbarForAll :show-logout="true">
    <!-- ส่ง slot ชื่อ left ไปใส่ใน Navbar -->
    <!-- breadcrumb แสดงเส้นทาง: "บทความ / เพิ่มบทความ" -->
    <template #left>
      <RouterLink to="/blogs" class="opacity-90 hover:underline">
        บทความ
      </RouterLink>
      <span class="mx-2 opacity-70">/</span>
      <span class="font-medium">เพิ่มบทความ</span>
    </template>
  </NavbarForAll>

  <!-- เนื้อหาหลัก -->
  <div class="container mx-auto max-w-5xl px-4 py-6">
    <!-- แสดงฟอร์ม BlogsCreate -->
    <BlogsCreate />
  </div>
</template>
