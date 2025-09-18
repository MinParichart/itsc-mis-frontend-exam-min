<script setup lang="ts">
// props = ค่าที่ parent ส่งเข้ามา
// modelValue = ค่าปัจจุบันของ toggle (true = เปิด, false = ปิด)
const props = defineProps<{ modelValue: boolean }>();

// emit = วิธีส่ง event กลับไปบอก parent ว่ามีการเปลี่ยนค่าแล้ว
// "update:modelValue" เป็น event มาตรฐานของ v-model
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

// toggle = ฟังก์ชันสลับค่า (true ↔ false) แล้ว emit ไปบอก parent
const toggle = () => emit("update:modelValue", !props.modelValue);
</script>

<template>
  <!-- กล่องใหญ่ของ toggle -->
  <!-- :class = bind ค่า class → ถ้า modelValue = true → สีน้ำเงิน, ถ้า false → สีเทา -->
  <!-- @click = เมื่อถูกคลิก เรียกฟังก์ชัน toggle -->
  <div class="w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer"
    :class="modelValue ? 'bg-blue-500' : 'bg-gray-300'" @click="toggle">
    <!-- จุดขาวที่อยู่ข้างใน toggle -->
    <!-- :class = bind class แบบ object → ถ้า modelValue = true → เพิ่ม translate-x-5 ให้จุดเลื่อนขวา -->
    <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
      :class="{ 'translate-x-5': modelValue }" />
  </div>
</template>
