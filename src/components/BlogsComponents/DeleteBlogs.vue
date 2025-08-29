<script setup lang="ts">

const props = defineProps<{
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{ 
  confirm: []; 
  cancel: [] 
}>()

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('cancel')
}
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[1000]">
      <!-- backdrop -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        @click="onBackdrop"
      />
      <!-- modal -->
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-sm rounded-xl bg-white shadow-lg">
          <div class="p-5 text-center">
            <div class="mx-auto mb-3 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <span class="text-2xl">🗑</span>
            </div>
            <h3 class="text-lg font-semibold mb-1">{{ props.title || 'ลบข้อมูล' }}</h3>
            <p class="text-sm text-gray-600" v-html="props.message"></p>
          </div>
          <div class="flex items-center justify-end gap-2 px-5 pb-5">
            <button
              class="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              :disabled="loading"
              @click="$emit('cancel')"
            >
              {{ props.cancelText || 'ยกเลิก' }}
            </button>
            <button
              class="px-4 py-2 rounded-lg text-white disabled:opacity-60"
              :class="danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
              :disabled="loading"
              @click="$emit('confirm')"
            >
              {{ loading ? 'กำลังลบ...' : (props.confirmText || 'ลบ') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
