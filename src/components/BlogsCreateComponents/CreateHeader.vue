<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <!-- แถบหัวเรื่องของหน้าสร้างบทความ -->
  <div class="flex items-center justify-between mb-4">
    <!-- breadcrumb -->
    <nav class="text-sm">
      <RouterLink to="/blogs" class="text-gray-500 hover:underline">บทความ</RouterLink>
      <span class="mx-1 text-gray-400">/</span>
      <span class="text-gray-800 font-medium">เพิ่มบทความ</span>
    </nav>

    <!-- ออกจากระบบ -->
    <button
      class="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
      @click="logout"
      aria-label="ออกจากระบบ"
    >
      ออกจากระบบ
    </button>
  </div>
</template>
