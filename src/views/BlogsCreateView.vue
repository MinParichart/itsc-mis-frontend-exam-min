<script setup lang="ts">
import Axios from "axios"
import { computed, reactive, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const API_BASE = import.meta.env.VITE_API_BASE as string
// ถ้าไม่ได้ตั้ง env แยก ให้โพสต์ที่ /blogs เป็นค่าเริ่มต้น
const BLOGS_CREATE = (import.meta.env.VITE_API_BLOGS_CREATE as string) || "/blogs"

type Form = {
  title: string
  body: string
  image: File | null
}

const form = reactive<Form>({
  title: "",
  body: "",
  image: null,
})

const loading = ref(false)
const touched = reactive({ title: false, body: false, image: false })
const previewUrl = ref<string | null>(null)

function onPickFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] || null
  form.image = file
  touched.image = true
  previewUrl.value = file ? URL.createObjectURL(file) : null
}

const errors = computed(() => {
  const title = !form.title.trim()
    ? "กรุณากรอกหัวข้อ"
    : form.title.trim().length < 3
    ? "หัวข้อต้องยาวอย่างน้อย 3 ตัวอักษร"
    : ""

  const body = !form.body.trim()
    ? "กรุณากรอกเนื้อหา"
    : form.body.trim().length < 10
    ? "เนื้อหาต้องยาวอย่างน้อย 10 ตัวอักษร"
    : ""

  let image = ""
  if (form.image) {
    if (!form.image.type.startsWith("image/")) image = "อัปโหลดได้เฉพาะไฟล์รูปภาพ"
    else if (form.image.size > 2 * 1024 * 1024) image = "ขนาดไฟล์รูปสูงสุด 2 MB"
  }

  return { title, body, image }
})

const isValid = computed(() => !errors.value.title && !errors.value.body && !errors.value.image)

async function onSubmit() {
  touched.title = touched.body = true
  if (!isValid.value) return

  try {
    loading.value = true

    const fd = new FormData()
    fd.append("title", form.title.trim())
    fd.append("content", form.body.trim()) // 👈 ถ้า API ใช้ชื่อ field อื่น เช่น "body" ให้แก้ตรงนี้
    if (form.image) fd.append("image", form.image)

    await Axios.post(`${API_BASE}${BLOGS_CREATE}`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })

    // เสร็จแล้วกลับหน้า list
    router.push({ name: "blogs" })
  } catch (err) {
    console.error(err)
    alert("บันทึกไม่สำเร็จ กรุณาลองใหม่")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="bg-white shadow-sm rounded-xl p-6">
      <h1 class="text-xl font-semibold mb-6">เพิ่มบทความ</h1>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <!-- หัวข้อ -->
        <div>
          <label class="block mb-1 font-medium">หัวข้อ <span class="text-red-500">*</span></label>
          <input
            v-model="form.title"
            @blur="touched.title = true"
            type="text"
            class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ใส่หัวข้อบทความ"
          />
          <p v-if="touched.title && errors.title" class="text-sm text-red-600 mt-1">{{ errors.title }}</p>
        </div>

        <!-- เนื้อหา -->
        <div>
          <label class="block mb-1 font-medium">เนื้อหา <span class="text-red-500">*</span></label>
          <textarea
            v-model="form.body"
            @blur="touched.body = true"
            rows="6"
            class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="พิมพ์เนื้อหา…"
          />
          <p v-if="touched.body && errors.body" class="text-sm text-red-600 mt-1">{{ errors.body }}</p>
        </div>

        <!-- รูปภาพ -->
        <div>
          <label class="block mb-1 font-medium">รูปภาพ (ไม่บังคับ)</label>
          <input type="file" accept="image/*" @change="onPickFile" class="block w-full" />
          <p v-if="touched.image && errors.image" class="text-sm text-red-600 mt-1">{{ errors.image }}</p>

          <div v-if="previewUrl" class="mt-3">
            <img :src="previewUrl" alt="preview" class="h-32 rounded-lg object-cover" />
          </div>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="loading || !isValid"
            class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg"
          >
            {{ loading ? "กำลังบันทึก..." : "บันทึก" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
