<!-- src/views/BlogsCreateView.vue -->
<script setup lang="ts">
import BlogsCreate from '@/components/BlogsCreate.vue'; // = ไฟล์ฟอร์มของคุณ
import NavbarForAll from '@/components/NavbarForAll.vue';
</script>

<template>
  <NavbarForAll :show-logout="true">
    <!-- breadcrumb อยู่บนแถบน้ำเงิน -->
    <template #left>
      <RouterLink to="/blogs" class="opacity-90 hover:underline">บทความ</RouterLink>
      <span class="mx-2 opacity-70">/</span>
      <span class="font-medium">เพิ่มบทความ</span>
    </template>
  </NavbarForAll>

  <div class="container mx-auto max-w-5xl px-4 py-6">
    <BlogsCreate />
  </div>
</template>
