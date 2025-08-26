<script setup lang="ts">
import { useRouter } from 'vue-router';
const props = defineProps<{ showLogout?: boolean }>()
const router = useRouter()
function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <!-- แถบสีน้ำเงิน -->
  <header class="bg-blue-600 text-white">
    <div class="container mx-auto h-12 px-4 flex items-center justify-between">
      <!-- ซ้าย: breadcrumb (ส่งผ่าน slot) ; ถ้าไม่ส่ง ให้โชว์ "บทความ" -->
      <nav class="flex items-center gap-2 text-white/95">
        <slot name="left">
          <span class="font-semibold">บทความ</span>
        </slot>
      </nav>

      <!-- ขวา: action บน navbar -->
      <div class="flex items-center gap-3">
        <slot name="right"></slot>
        <button
          v-if="props.showLogout"
          class="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600"
          @click="logout"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  </header>
</template>
