<script setup lang="ts">
import BlogsUpdate from "@/components/BlogsComponents/BlogsUpdate.vue"
import BreadcrumbBar from "@/components/BlogsCreateComponents/BreadcrumbBar.vue"
import NavbarForAll from "@/components/NavbarForAll.vue"
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
        <span class="font-semibold">แก้ไขบทความ</span>
      </BreadcrumbBar>
    </template>

    <template #right>
      <RouterLink :to="{ name: 'blogs_id', params: { id } }"
                  class="text-white/90 hover:underline text-sm">
        ย้อนกลับ
      </RouterLink>
    </template>
  </NavbarForAll>

  <div class="container mx-auto max-w-5xl px-4 py-6">
    <BlogsUpdate />
  </div>
</template>
