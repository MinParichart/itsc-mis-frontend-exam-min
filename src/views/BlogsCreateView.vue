<script setup lang="ts">
import BlogsCreate from '@/components/BlogsComponents/BlogsCreate.vue';
import BreadcrumbBar from "@/components/BlogsComponents/BreadcrumbBar.vue";
import NavbarForAll from "@/components/BlogsComponents/NavbarForAll.vue";
</script>

<template>
  <!-- Navbar + breadcrumb -->
  <NavbarForAll :show-logout="true">
    <template #left>
      <BreadcrumbBar>
        <RouterLink to="/blogs" class="font-semibold hover:underline">บทความ</RouterLink>
        <span class="opacity-80">/</span>
        <span class="font-semibold">เพิ่มบทความ</span>
      </BreadcrumbBar>
    </template>
  </NavbarForAll>

  <!-- เนื้อหา: จำกัดความกว้างการ์ด ไม่ให้เต็มจอ -->
  <div class="container mx-auto max-w-4xl px-4 py-6">
    <BlogsCreate mode="create" :texts="{ title: 'หัวข้อ', content: 'เนื้อหา', submit: 'บันทึก' }" />
  </div>
</template>
