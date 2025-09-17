<script setup lang="ts">
// import Icon
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline"; // ไอคอนตาเอาไว้กดสลับรหัสผ่านโชว์/ซ่อน

// import Axios, AxiosError และใส่ type ให้ response
import Axios, { AxiosError } from "axios"; // Axios → ใช้ยิง API (เชื่อมต่อกับ server) // AxiosError → ไว้จัดการ error จาก Axios ให้ type-safe
import { ref } from "vue"; // สร้าง state (ตัวแปร reactive) ใน Vue
import { useRoute, useRouter } from "vue-router"; // ใช้จัดการเส้นทาง (routing) เช่น redirect ไป /blogs

// สร้างตัวแปร
const showPass = ref<boolean>(false); // สลับแสดง/ซ่อน password

const username = ref<string>(""); // เก็บค่าที่ผู้ใช้กรอกช่อง username
const password = ref<string>(""); // เก็บค่าที่ผู้ใช้กรอกช่อง password
const err = ref<string>(""); // เก็บข้อความ error (ถ้ามี)
const loading = ref<boolean>(false); // true ตอนกำลังโหลด, false เมื่อเสร็จ

const router = useRouter();
const route = useRoute();

// ประกาศชนิดข้อมูลที่คาดหวังจาก API (Login Response)
interface LoginResp {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
}

async function login() {
  err.value = ""; // เคลียร์ error เก่า
  loading.value = true;  // กำลังโหลด
  try {
    // ยิง API = การส่งคำขอ (request) แบบ POST ไป /auth/login หา server 
    // baseURL ถูกตั้งใน main.ts แล้ว - เรียกแบบ relative ได้
    // { data } คือ ข้อมูลที่เซิร์ฟเวอร์ตอบกลับมา (response) เช่น access_token, refresh_token // เราสนใจแค่ data เลยใช้ object destructuring ดึงออกมาเลย เป็น short syntax
    const { data } = await Axios.post<LoginResp>("/auth/login", { // Axios.post คือการ ส่ง HTTP Request แบบ POST ไปยังเซิร์ฟเวอร์ // URL ปลายทางของ API ที่จะติดต่อ (baseURL ถูกตั้งไว้ใน main.ts เช่น https://exam-api.dev.mis.cmu.ac.th/api) //await → บอกให้รอจนกว่า server จะตอบกลับมาก่อนค่อยไปทำบรรทัดถัดไป
      username: username.value, // ข้อมูลที่ user พิมพ์ในฟอร์ม แล้วส่งไปให้ server ตรวจสอบ
      password: password.value, 
    });
    // localStorage.setItem คือการ เก็บข้อมูลแบบถาวรลง browser
    // localStorage.setItem - localStorage เป็น object ของ browser (JavaScript API) ที่ให้เราสามารถเก็บ key-value pairs ได้ (เป็น string ทั้งหมด) // setItem(key, value) = ใช้เพื่อเก็บข้อมูลใน localStorage - Browser จะเก็บข้อมูลใน storage ของเครื่อง key = "username", value = "min"
    localStorage.setItem("token", data.access_token); // เก็บ access_token ไว้ → ใช้เรียก API อื่นที่ต้อง auth ได้
    localStorage.setItem("refresh_token", data.refresh_token); // เก็บ refresh_token ไว้ → เวลา access token หมดอายุ ใช้ refresh token ขอใหม่
    localStorage.setItem( // เก็บ token_exp ไว้ → เก็บเวลา (timestamp) ที่ token หมดอายุ จะได้เอามาเช็คก่อนใช้
      "token_exp",
      String(Date.now() + data.expires_in * 1000) // เวลาหมดอายุ (ปัจจุบัน + expires_in)
    ); // 5 นาที

    router.push((route.query.redirect as string) || "/blogs"); // ถ้ามี query ?redirect=/somepage จะเด้งกลับไปหน้านั้น - ถ้าไม่มี เด้งไป /blogs // router.push(...) ใช้เปลี่ยนหน้า // route.query.redirect เอาไว้เก็บ path เดิมก่อน redirect มาหน้า login
  } catch (e: unknown) { // e = สิ่งที่ throw ออกมาจาก try/catch (เช่น error ที่ Axios โยนมา)
    const ax = e as AxiosError<{error : string, message : string}>;
    const status = ax.response?.status; // เก็บเลขสถานะ HTTP (200, 400, 401, 500 …)
    const payload = ax.response?.data; // เก็บเนื้อหาที่ server ส่งมา (ยิง API แล้ว Server ตอบกลับมา ค่าที่ตอบมาจะอยู่ใน response.data) เช่น { "error": "Incorrect username or password." }

    // ให้สถานะ 
    if (status === 400) {
      err.value = "Invalid username or password.";
    } else if (status === 401) {
      err.value = "Incorrect username or password.";
    } else {
      // เช็คว่า server ส่งข้อความ error อะไรมาบ้าง
      const message =
        (typeof payload === "string" // ถ้า payload เป็น string เอา string นั้นมาใช้เลย
          ? payload
          : payload?.error || payload?.message) || // ถ้าเป็น object หยิบ payload.error หรือ payload.message มา
        ax.message || // ถ้าไม่มีอะไรเลย fallback ไปใช้ ax.message หรือข้อความที่เรากำหนดเอง
        "เข้าสู่ระบบไม่สำเร็จ";
      err.value = message;
    }
  } finally { // ปิด loading ไม่ว่าผลจะสำเร็จหรือ error
    loading.value = false;
  }
}
</script>

<template>
  <!-- คอนเทนเนอร์ให้ responsive -->
  <div class="min-h-screen grid place-items-center px-4 sm:px-6 lg:px-8">
    <!-- ความกว้าง/ระยะห่าง responsive - @submit.prevent กดปุ่มแล้วเรียกฟังก์ชัน login และกัน reload หน้า -->
    <form @submit.prevent="login"
      class="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-xl shadow p-4 sm:p-6 md:p-8 space-y-3">
      <h1 class="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
        เข้าสู่ระบบ
      </h1>

      <div>
        <div class="text-gray-500 mb-1">ผู้ใช้งาน</div>
        <input v-model="username" type="text" 
          class="w-full rounded px-3 py-2 border border-gray-300 hover:border-2 hover:border-blue-500 focus:outline-none focus:border-2 focus:border-blue-500 transition-all" />
      </div>

      <div>
        <div class="text-gray-500 mb-1">รหัสผ่าน</div>
        <div class="relative mb-1">
          <!-- pr-10 กันไอคอนไม่ให้ทับตัวอักษร -->
          <input v-model="password" :type="showPass ? 'text' : 'password'"
            class="w-full rounded px-3 py-2 pr-10 border border-gray-300 hover:border-2 hover:border-blue-500 focus:outline-none focus:border-2 focus:border-blue-500 transition-all" />
          <button type="button" @click="showPass = !showPass"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
            :aria-label="showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'">
            <EyeIcon v-if="!showPass" class="w-5 h-5" />
            <EyeSlashIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- แสดงข้อความ err ที่หน้าเว็บ -->
      <p v-if="err" class="text-red-600 text-sm">{{ err }}</p>

      <!-- ถ้า loading === true → ปุ่มถูกปิด (disable) → user จะกดไม่ได้ - ถ้า loading === false → ปุ่มใช้งานได้ - ใช้ตอน login เพราะระหว่างรอ server ตอบกลับ ไม่อยากให้ user กดซ้ำๆ -->
      <button :disabled="loading"
        class="w-full bg-green-600 hover:bg-green-700 text-white rounded px-3 py-2 md:py-3 disabled:opacity-60 transition-colors">
        {{ loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
      </button>
    </form>
  </div>
</template>
