<script setup lang="ts">
import BreadcrumbBar from '@/components/BlogsCreateComponents/BreadcrumbBar.vue';
import NavbarForAll from '@/components/NavbarForAll.vue';
import BlogsList from '@/components/ฺBlogsList.vue';
</script>

<template>
  <!-- Navbar + breadcrumb -->
  <NavbarForAll :show-logout="true">
    <template #left>
      <BreadcrumbBar>
        <span class="font-semibold">บทความ</span>
      </BreadcrumbBar>
    </template>
  </NavbarForAll>

  <!-- เนื้อหา (BlogsList มี container ภายในอยู่แล้ว) -->
  <BlogsList />
</template>
