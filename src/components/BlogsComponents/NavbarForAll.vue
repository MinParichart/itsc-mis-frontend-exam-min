<script setup lang="ts">
import Axios from "axios"; // ใช้เรียก API
import { onMounted, ref } from "vue"; // ตัวช่วยจาก Vue
import { useRouter } from "vue-router"; // ใช้เปลี่ยนหน้า (navigate)

// ใช้งาน router
const router = useRouter();

// state เก็บชื่อผู้ใช้ เริ่มจาก localStorage (ถ้ามี)
const username = ref<string | null>(localStorage.getItem("username") ?? null);

// ฟังก์ชัน logout
const handleLogout = async () => {
  try {
    await Axios.delete("/auth/logout"); // เรียก API logout (server จัดการ)
  } catch {
    // ถ้า API fail ก็ไม่เป็นไร ยังลบ token ได้เอง
  }
  // ลบ token ใน localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_exp");
  // พากลับไปหน้า login
  router.push("/login");
};

// โหลดข้อมูลผู้ใช้ตอน mount component
onMounted(async () => {
  try {
    const { data } = await Axios.get("/auth/me"); // ex. { username: "user123" }
    username.value = data?.username ?? null;      // เซฟชื่อผู้ใช้ใน state
    if (username.value) localStorage.setItem("username", username.value); // เก็บลง localStorage
  } catch {
    // ถ้า error เช่น token หมดอายุ → ไม่ทำอะไร
  }
});
</script>


<template>
  <!-- Navbar สีน้ำเงิน -->
  <nav class="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2">
    <!-- กล่อง flex จัดเรียง 2 ฝั่ง: ซ้าย (logo/ชื่อเว็บ) และขวา (user + logout) -->
    <div class="mx-auto max-w-6xl flex justify-between items-center gap-2">

      <!-- ฝั่งซ้าย: โลโก้/ลิงก์ไปหน้าแรก -->
      <RouterLink to="/" class="font-semibold text-base md:text-lg">
        บทความ
      </RouterLink>

      <!-- ฝั่งขวา: user + logout -->
      <div class="flex items-center gap-2 md:gap-3">
        <!-- ถ้ามี username จะแสดง -->
        <span v-if="username" class="opacity-90 text-xs md:text-sm">
          สวัสดี, {{ username }}
        </span>

        <!-- ปุ่ม logout -->
        <button @click="handleLogout"
          class="inline-flex items-center gap-1.5 md:gap-2 bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1.5 text-sm">
          <!-- ไอคอน logout -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-6 4V5m0 14v-4" />
          </svg>
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  </nav>
</template>
