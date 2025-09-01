<script setup lang="ts">
import Axios from "axios";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

/* ----- config ----- */
const API_BASE =
  (import.meta.env.VITE_API_BASE as string) ||
  "https://exam-api.dev.mis.cmu.ac.th/api";
const BLOGS_INDEX =
  (import.meta.env.VITE_API_BLOGS_INDEX as string) || "/blogs";
const AUTH_HEADER: Record<string, string> = {
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
};
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

/* ----- helpers ----- */
function fixImgUrl(u?: string): string | undefined {
  if (!u) return undefined;
  const clean = u.replace(/\\/g, "/").replace(/^\/+/, "/");
  if (/^https?:\/\//i.test(clean)) return clean;
  return `${API_ORIGIN}${clean.startsWith("/") ? "" : "/"}${clean}`;
}

/* ----- state ----- */
type Form = { title: string; content: string; file: File | null };
const form = reactive<Form>({ title: "", content: "", file: null });
const touched = reactive({ title: false, content: false, file: false });
const loading = ref(false);
const apiError = ref<string | null>(null);
const preview = ref<string | null>(null); // รูปเดิมหรือรูปใหม่

/* ----- validation - ใช้ vuelidate----- */
const errors = computed(() => {
  const e = { title: "", content: "", file: "" };
  if (!form.title.trim()) e.title = "กรุณากรอกหัวข้อ";
  else if (form.title.trim().length < 3)
    e.title = "หัวข้อต้องยาวอย่างน้อย 3 ตัวอักษร";

  if (!form.content.trim()) e.content = "กรุณากรอกเนื้อหา";
  else if (form.content.trim().length < 10)
    e.content = "เนื้อหาต้องยาวอย่างน้อย 10 ตัวอักษร";

  if (form.file) {
    if (!form.file.type.startsWith("image/"))
      e.file = "อัปโหลดได้เฉพาะไฟล์รูปภาพ";
    else if (form.file.size > 2 * 1024 * 1024) e.file = "ขนาดไฟล์สูงสุด 2 MB";
  }
  return e;
});
const isValid = computed(
  () => !errors.value.title && !errors.value.content && !errors.value.file
);

/* ----- load existing blog ----- */
type ApiImg = { url?: string };
type ApiBlog = {
  id: number | string;
  title?: string;
  content?: string;
  img?: ApiImg;
  Img?: ApiImg;
};

const emit = defineEmits<{ "detail-title": [string] }>();

async function loadBlog() {
  loading.value = true;
  apiError.value = null;
  try {
    const { data } = await Axios.get<ApiBlog>(
      `${API_BASE}${BLOGS_INDEX}/${id}`,
      { headers: AUTH_HEADER }
    );
    form.title = String(data.title ?? "");
    form.content = String(data.content ?? "");
    preview.value = fixImgUrl(data.img?.url ?? data.Img?.url) || null;
    // ✅ ส่งชื่อเรื่องขึ้นไปให้ parent ใส่ breadcrumb
    emit("detail-title", form.title.trim());
  } catch (e: any) {
    apiError.value =
      (Axios.isAxiosError(e) &&
        (e.response?.data?.message || e.response?.data?.error)) ||
      e?.message ||
      "โหลดข้อมูลไม่สำเร็จ";
  } finally {
    loading.value = false;
  }
}

onMounted(loadBlog);

// (ออปชัน) ถ้าต้องการให้ breadcrumb เปลี่ยนตามที่ผู้ใช้พิมพ์หัวข้อ
watch(
  () => form.title,
  (t) => emit("detail-title", (t || "").trim())
);

/* ----- handlers ----- */
function onPick(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] || null;
  form.file = f;
  touched.file = true;
  preview.value = f ? URL.createObjectURL(f) : preview.value; // ถ้าเลือกใหม่ → ใช้รูปใหม่
}

async function onSubmit() {
  touched.title = touched.content = true;
  apiError.value = null;
  if (!isValid.value) return;

  try {
    loading.value = true;
    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("content", form.content.trim());
    if (form.file) fd.append("blog_img", form.file); // ไม่เลือกก็ไม่ส่ง = คงรูปเดิม

    await Axios.put(`${API_BASE}${BLOGS_INDEX}/${id}`, fd, {
      headers: { ...AUTH_HEADER, "Content-Type": "multipart/form-data" },
    });

    router.push({ name: "blogs_id", params: { id } });
  } catch (e: any) {
    apiError.value =
      (Axios.isAxiosError(e) &&
        (e.response?.data?.message || e.response?.data?.error)) ||
      e?.message ||
      "บันทึกไม่สำเร็จ";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="bg-white shadow rounded-2xl border border-gray-200 p-6 md:p-8">
    <h2 class="text-lg font-semibold mb-4">แก้ไขบทความ</h2>

    <div v-if="loading" class="text-gray-500">กำลังโหลด...</div>
    <form v-else class="space-y-6" @submit.prevent="onSubmit">
      <!-- title -->
      <div>
        <label class="block mb-1 font-medium">หัวข้อ <span class="text-red-500">*</span></label>
        <input v-model="form.title" @blur="touched.title = true" type="text" placeholder="ระบุหัวข้อบทความ"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p v-if="touched.title && errors.title" class="text-sm text-red-600 mt-1">
          {{ errors.title }}
        </p>
      </div>

      <!-- content -->
      <div>
        <label class="block mb-1 font-medium">เนื้อหา <span class="text-red-500">*</span></label>
        <textarea v-model="form.content" @blur="touched.content = true" rows="8" placeholder="พิมพ์เนื้อหา…"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p v-if="touched.content && errors.content" class="text-sm text-red-600 mt-1">
          {{ errors.content }}
        </p>
      </div>

      <!-- image -->
      <div>
        <label class="block mb-1 font-medium">รูปภาพ (ไม่บังคับ)</label>
        <input type="file" accept="image/*" @change="onPick" class="block w-full" />
        <p class="text-xs text-gray-500 mt-1">ถ้าไม่อัปโหลด จะคงรูปเดิมไว้</p>
        <p v-if="touched.file && errors.file" class="text-sm text-red-600 mt-1">
          {{ errors.file }}
        </p>

        <img v-if="preview" :src="preview" alt="preview" class="mt-3 h-40 md:h-52 rounded-lg object-contain mx-auto" />
      </div>

      <div v-if="apiError" class="text-red-600 text-sm">{{ apiError }}</div>

      <button type="submit" :disabled="loading || !isValid"
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg">
        {{ loading ? "กำลังบันทึก..." : "บันทึก" }}
      </button>
    </form>
  </div>
</template>
