<script setup lang="ts">
import BlogsUpdate from "@/components/BlogsComponents/BlogsUpdate.vue"
import BreadcrumbBar from "@/components/BlogsComponents/BreadcrumbBar.vue"
import NavbarForAll from "@/components/BlogsComponents/NavbarForAll.vue"
import { useRoute } from "vue-router"

const route = useRoute()
const id = Number(route.params.id)
</script>

<template>
  <NavbarForAll :show-logout="true">
    <template #left>
      <BreadcrumbBar>
        <RouterLink to="/blogs" class="hover:underline font-semibold">บทความ</RouterLink>
        <span class="opacity-70">/</span>
        <span class="font-semibold"> {{ "title" }}</span>
        <span class="opacity-70">/</span>
        <span class="font-semibold">แก้ไขบทความ</span>
      </BreadcrumbBar>
    </template>

  </NavbarForAll>

  <div class="container mx-auto max-w-5xl px-4 py-6">
    <BlogsUpdate />
  </div>
</template>
