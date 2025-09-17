<script setup lang="ts">
import BlogsDetail from '@/components/BlogsComponents/BlogsDetail.vue'
import BreadcrumbBar from '@/components/BlogsComponents/BreadcrumbBar.vue'
import NavbarForAll from '@/components/BlogsComponents/NavbarForAll.vue'
import type { Blog } from '@/models/blog'
import { mapApiBlog } from '@/models/blog'
import * as svc from '@/services/blogService'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = Number(route.params.id)

const blog = ref<Blog | null>(null)
const title = ref<string>('')

onMounted(async () => {
  const data = await svc.fetchBlogById(id)
  blog.value = mapApiBlog(data)        // ✅ แปลง Api → UI (มี thumbnail แล้ว)
  title.value = blog.value?.title || ''
})
</script>

<template>
  <NavbarForAll :show-logout="true">
    <template #left>
      <BreadcrumbBar>
        <RouterLink to="/blogs" class="font-semibold hover:underline">บทความ</RouterLink>
        <span class="opacity-70">/</span>
        <span class="font-semibold">{{ title }}</span>
      </BreadcrumbBar>
    </template>
  </NavbarForAll>

  <div class="container mx-auto max-w-5xl px-4 py-6">
    <!-- แสดงรูปให้ชัวร์ -->
    <BlogsDetail v-if="blog" :blog="blog" />
  </div>
</template>
ห