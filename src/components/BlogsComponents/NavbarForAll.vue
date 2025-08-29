<script setup lang="ts">
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'; // หรือ /outline
import { useRouter } from 'vue-router';
const props = defineProps<{ showLogout?: boolean }>()
const router = useRouter()
function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <header class="bg-blue-600 text-white">
    <div class="container mx-auto h-12 px-4 flex items-center justify-between">
      <nav class="flex items-center gap-2 text-white/95">
        <slot name="left">
          <span class="font-semibold">บทความ</span>
        </slot>
      </nav>

      <div class="flex items-center gap-3">
        <slot name="right"></slot>
        <button v-if="props.showLogout" @click="logout" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
         bg-red-500 hover:bg-red-600 text-white">
          <ArrowRightOnRectangleIcon class="w-4 h-4 shrink-0" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  </header>
</template>
