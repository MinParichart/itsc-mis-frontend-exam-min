<script setup lang="ts">
const props = defineProps<{
  open: boolean;        // true/false ควบคุมว่า modal เปิดหรือปิด
  title?: string;       // ข้อความหัวข้อ (optional)
  message?: string;     // ข้อความรายละเอียด (optional)
  confirmText?: string; // ข้อความปุ่มยืนยัน (optional)
  cancelText?: string;  // ข้อความปุ่มยกเลิก (optional)
  danger?: boolean;     // ใช้เปลี่ยนสไตล์เป็นปุ่มสีแดง (ลบ/อันตราย)
  loading?: boolean;    // true = กำลังโหลด/กำลังลบ → ปุ่มจะ disable
}>();

const emit = defineEmits<{
  confirm: []; // event เมื่อกดยืนยัน
  cancel: [];  // event เมื่อกดยกเลิก
}>();

// ปิด modal เมื่อคลิกพื้นที่ backdrop (ด้านหลังกล่อง modal)
function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) emit("cancel");
}
</script>

<template>
  <!-- teleport → render modal ไปไว้บน <body> โดยตรง -->
  <teleport to="body">
    <!-- modal แสดงเมื่อ open = true -->
    <div v-if="open" class="fixed inset-0 z-[1000]">
      <!-- พื้นหลังมืด (backdrop) -->
      <!-- ถ้าคลิกนอกกล่อง → cancel -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px]" @click="onBackdrop" />

      <!-- กล่อง modal -->
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-sm rounded-xl bg-white shadow-lg">
          <!-- ส่วนบน: ไอคอน + title + message -->
          <div class="p-5 text-center">
            <div class="mx-auto mb-3 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <span class="text-2xl">🗑</span> <!-- ไอคอนถังขยะ -->
            </div>
            <h3 class="text-lg font-semibold mb-1">
              {{ props.title || "ลบข้อมูล" }}
              <!-- ถ้าไม่มีค่า title จะใช้ "ลบข้อมูล" -->
            </h3>
            <p class="text-sm text-gray-600" v-html="props.message"></p>
          </div>

          <!-- ส่วนล่าง: ปุ่ม cancel + confirm -->
          <div class="flex items-center justify-end gap-2 px-5 pb-5">
            <!-- ปุ่มยกเลิก -->
            <button class="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              :disabled="loading" @click="$emit('cancel')">
              {{ props.cancelText || "ยกเลิก" }}
            </button>

            <!-- ปุ่มยืนยัน -->
            <button class="px-4 py-2 rounded-lg text-white disabled:opacity-60" :class="danger
                ? 'bg-red-600 hover:bg-red-700'  // ถ้า danger = true → ปุ่มแดง
                : 'bg-blue-600 hover:bg-blue-700' // ถ้าไม่ → ปุ่มน้ำเงิน
              " :disabled="loading" @click="$emit('confirm')">
              <!-- ถ้า loading = true → ขึ้น "กำลังลบ..." -->
              {{ loading ? "กำลังลบ..." : props.confirmText || "ลบ" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
