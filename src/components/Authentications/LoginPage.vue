<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
// CHANGE 1: import AxiosError และใส่ type ให้ response
import Axios, { AxiosError } from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const showPass = ref(false);

const username = ref("");
const password = ref("");
const err = ref("");
const loading = ref(false);

const router = useRouter();
const route = useRoute();

// CHANGE 2: ประกาศชนิดข้อมูลที่คาดหวังจาก API
interface LoginResp {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
}

async function login() {
  err.value = "";
  loading.value = true;
  try {
    // baseURL ถูกตั้งใน main.ts แล้ว → เรียกแบบ relative ได้
    // CHANGE 3: ใส่ generic <LoginResp> ให้ Axios.post เพื่อได้ typing
    const { data } = await Axios.post<LoginResp>("/auth/login", {
      username: username.value,
      password: password.value,
    });

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem(
      "token_exp",
      String(Date.now() + data.expires_in * 1000)
    ); // 5 นาที

    router.push((route.query.redirect as string) || "/blogs");
  } catch (e: unknown) {
    const ax = e as AxiosError<any>;
    const status = ax.response?.status;
    const payload = ax.response?.data;

    // CHANGE 4: บังคับให้ 400/401 แสดงข้อความเดียวกันเสมอ
    if (status === 400 || status === 401) {
      err.value = "Incorrect username or password.";
    } else {
      // เผื่อกรณีอื่นๆ แสดงข้อความจากเซิร์ฟเวอร์ ถ้ามี
      const msg =
        (typeof payload === "string" ? payload : payload?.error || payload?.message) ||
        ax.message ||
        "เข้าสู่ระบบไม่สำเร็จ";
      err.value = msg;
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <!-- คอนเทนเนอร์ให้ responsive -->
  <div class="min-h-screen grid place-items-center px-4 sm:px-6 lg:px-8">
    <!-- ความกว้าง/ระยะห่าง responsive -->
    <form @submit.prevent="login" class="w-full max-w-xs sm:max-w-sm md:max-w-md
             bg-white rounded-xl shadow
             p-4 sm:p-6 md:p-8 space-y-3">
      <h1 class="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
        เข้าสู่ระบบ
      </h1>

      <div>
        <div class="text-gray-500 mb-1">ผู้ใช้งาน</div>
        <input v-model="username" type="text" required class="w-full rounded px-3 py-2
                 border border-gray-300
                 hover:border-2 hover:border-blue-500
                 focus:outline-none focus:border-2 focus:border-blue-500
                 transition-all" />
      </div>

      <div>
        <div class="text-gray-500 mb-1">รหัสผ่าน</div>
        <div class="relative mb-1">
          <!-- pr-10 กันไอคอนไม่ให้ทับตัวอักษร -->
          <input v-model="password" :type="showPass ? 'text' : 'password'" required class="w-full rounded px-3 py-2 pr-10
                   border border-gray-300
                   hover:border-2 hover:border-blue-500
                   focus:outline-none focus:border-2 focus:border-blue-500
                   transition-all" />
          <button type="button" @click="showPass = !showPass" class="absolute right-2 top-1/2 -translate-y-1/2 p-1
                   text-gray-500 hover:text-gray-700" :aria-label="showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'">
            <EyeIcon v-if="!showPass" class="w-5 h-5" />
            <EyeSlashIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <p v-if="err" class="text-red-600 text-sm">{{ err }}</p>

      <button :disabled="loading" class="w-full bg-green-600 hover:bg-green-700
               text-white rounded px-3 py-2 md:py-3
               disabled:opacity-60 transition-colors">
        {{ loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
      </button>
    </form>
  </div>
</template>
