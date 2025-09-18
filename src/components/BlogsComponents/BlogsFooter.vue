<script setup lang="ts">
// รับ props (ค่าที่ส่งมาจาก parent)
// total = จำนวนข้อมูลทั้งหมด
// pageSize = จำนวนข้อมูลต่อ 1 หน้า
const props = defineProps<{ total: number; pageSize: number }>();

// emit → ใช้ส่ง event กลับไปให้ parent
// "update:pageSize" = event ที่จะบอก parent ว่ามีการเปลี่ยนจำนวนรายการต่อหน้าแล้ว
// [number] = ค่าที่ส่งออกไปคือเลขจำนวนรายการใหม่
const emit = defineEmits<{ "update:pageSize": [number] }>();
</script>

<template>
  <!-- container จัด layout -->
  <div class="flex justify-between items-center mt-4 text-sm text-gray-600">

    <!-- แสดงจำนวนข้อมูลทั้งหมด -->
    <span>แสดง {{ total }} รายการ</span>

    <!-- ส่วนควบคุมเลือกจำนวนต่อหน้า -->
    <div class="flex items-center space-x-2 ml-auto">
      <span>จำนวนต่อหน้า</span>

      <!-- select dropdown -->
      <!-- :value = binding ค่าเริ่มต้นของ dropdown = props.pageSize -->
      <!-- @change = เวลาเปลี่ยนค่า dropdown
        $event.target.value = ค่าใหม่จาก select (string)
        +(...) = แปลงเป็น number
        emit(...) = ส่งค่าออกไปบอก parent component
      -->
      <select :value="pageSize" @change="
        emit('update:pageSize', +($event.target as HTMLSelectElement).value)
        " class="border rounded px-2 py-1">
        <!-- option ที่เลือกได้ -->
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
      </select>
    </div>
  </div>
</template>
