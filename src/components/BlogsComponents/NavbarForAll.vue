<script setup lang="ts">
import Axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref<string | null>(localStorage.getItem("username") ?? null);

const handleLogout = async () => {
  try { await Axios.delete("/auth/logout"); } catch {}
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_exp");
  router.push("/login");
};

onMounted(async () => {
  try {
    const { data } = await Axios.get("/auth/me"); // ex. { username: "user123" }
    username.value = data?.username ?? null;
    if (username.value) localStorage.setItem("username", username.value);
  } catch {
    
  }
});
</script>

<template>
 <!-- CHANGE 1: ลด padding แนวตั้งจาก py-3 -> py-2 (mobile) และ md:py-2 คงบาง -->
  <nav class="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2">
    <!-- CHANGE 2: จำกัดความกว้างภายในและลด gap -->
    <div class="mx-auto max-w-6xl flex justify-between items-center gap-2">
      <!-- CHANGE 3: ลดขนาดหัวเรื่อง text-base บนมือถือ, md:text-lg บนจอใหญ่ -->
      <RouterLink to="/" class="font-semibold text-base md:text-lg">
        บทความ
      </RouterLink>

      <!-- (optional) โชว์ชื่อผู้ใช้ถ้ามี -->
      <div class="flex items-center gap-2 md:gap-3">
        <!-- CHANGE 4: ย่อฟอนต์ชื่อผู้ใช้ -->
        <span v-if="username" class="opacity-90 text-xs md:text-sm">
          สวัสดี, {{ username }}
        </span>

        <!-- CHANGE 5: ย่อปุ่ม logout (padding/ฟอนต์/ไอคอน) -->
        <button
          @click="handleLogout"
          class="inline-flex items-center gap-1.5 md:gap-2 bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1.5 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-6 4V5m0 14v-4" />
          </svg>
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  </nav>
  </template>
