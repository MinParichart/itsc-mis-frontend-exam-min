<template>
  <nav class="bg-blue-600 text-white px-4 py-3">
    <div class="mx-auto flex justify-between items-center">
      <!-- Logo / ชื่อเว็บ -->
      <RouterLink to="/" class="text-lg font-bold">บทความ</RouterLink>

      <!-- Logout button -->
      <button
        @click="handleLogout"
        class="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
      >
        <!-- Icon (Logout) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-6 4V5m0 14v-4" />
        </svg>
        <span>ออกจากระบบ</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const handleLogout = () => {
  // TODO: ใส่ logic logout ของคุณ เช่นเคลียร์ token / redirect
  alert("Logged out!");
}
</script>
