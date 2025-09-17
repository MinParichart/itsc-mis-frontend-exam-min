<script setup lang="ts">
import type { Blog } from '@/models/blog'
import { fixImgUrl } from '@/models/blog'
import { helpers, minLength, required, useVuelidate } from '@/plugins/vuelidate'
import * as svc from '@/services/blogService'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Mode = 'create' | 'update'

const props = defineProps<{
  mode: Mode
  initial?: Partial<Blog>
  blogId?: number
  texts?: {
    title?: string
    content?: string
    submit?: string
  }
}>()

const emit = defineEmits<{ (e:'submitted', id:number): void }>()

const router = useRouter()
const route = useRoute()

const form = reactive<{ title: string; content: string; file: File | null }>({
  title: props.initial?.title || '',
  content: props.initial?.content || '',
  file: null,
})
const preview = ref<string | null>(props.initial?.thumbnail ? fixImgUrl(props.initial.thumbnail) || null : null)
const loading = ref(false)
const apiError = ref('')

// vuelidate rules
const rules = computed(() => ({
  title: { required: helpers.withMessage('กรุณากรอกหัวข้อ', required), minLen: helpers.withMessage('หัวข้อต้องยาวอย่างน้อย 3 ตัวอักษร', minLength(3)) },
  content: { required: helpers.withMessage('กรุณากรอกเนื้อหา', required), minLen: helpers.withMessage('เนื้อหาต้องยาวอย่างน้อย 10 ตัวอักษร', minLength(10)) },
}))

const v$ = useVuelidate(rules, form)

function onPick(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] || null
  form.file = f
  preview.value = f ? URL.createObjectURL(f) : preview.value
}

async function onSubmit() {
  apiError.value = ''
  await v$.value.$validate()
  if (v$.value.$invalid) return

  try {
    loading.value = true
    if (props.mode === 'create') {
      const created = await svc.createBlog({ title: form.title.trim(), content: form.content.trim(), file: form.file })
      emit('submitted', Number(created.id))
      router.push({ name: 'blogs_id', params: { id: created.id } })
    } else {
      const id = props.blogId!
      await svc.updateBlog(id, { title: form.title.trim(), content: form.content.trim(), file: form.file })
      emit('submitted', id)
      router.push({ name: 'blogs_id', params: { id } })
    }
  } catch (e:any) {
    apiError.value = e?.response?.data?.error || e?.message || 'บันทึกไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 md:p-6 space-y-4">
    <div v-if="apiError" class="rounded bg-red-50 border border-red-200 text-red-600 px-3 py-2 text-sm">
      {{ apiError }}
    </div>

    <div class="space-y-1">
      <label class="text-gray-700">{{ texts?.title || 'หัวข้อ' }}</label>
      <input v-model="form.title" type="text" class="w-full rounded border border-gray-400 px-3 py-2 outline-none focus:ring" />
      <p v-if="v$.$error && v$.title.$invalid" class="text-red-600 text-sm">{{ v$.title.$errors[0]?.$message }}</p>
    </div>

    <div class="space-y-1">
      <label class="text-gray-700">{{ texts?.content || 'เนื้อหา' }}</label>
      <textarea v-model="form.content" rows="6" class="w-full rounded border border-gray-400  px-3 py-2 outline-none focus:ring"></textarea>
      <p v-if="v$.$error && v$.content.$invalid" class="text-red-600 text-sm">{{ v$.content.$errors[0]?.$message }}</p>
    </div>

    <div class="space-y-1 border border-gray-400 rounded">
      <label class="text-gray-700">รูปภาพ </label>
      <input type="file" accept="image/*" @change="onPick" />
      <div class="mt-2">
        <img v-if="preview" :src="preview" alt="preview" class="max-h-40 rounded border object-cover" />
      </div>
    </div>

    <div class="flex justify-end">
      <button :disabled="loading" @click="onSubmit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
        {{ texts?.submit || (mode === 'create' ? 'บันทึก' : 'อัปเดต') }}
      </button>
    </div>
  </div>
</template>
