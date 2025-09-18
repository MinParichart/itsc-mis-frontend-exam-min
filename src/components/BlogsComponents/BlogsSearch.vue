<script setup lang="ts">
// defineModel → ใช้สร้าง v-model สำหรับ component นี้
// <string> → ระบุว่า model จะเก็บข้อมูลเป็นข้อความ (string) เท่านั้น
// เวลา parent component ใช้ สามารถเขียน <SearchBox v-model="keyword" /> ได้เลย
const model = defineModel<string>();
</script>

<template>
  <div class="mb-4"> <!-- กรอบภายนอก เว้นระยะห่างด้านล่าง 1rem (margin-bottom-4) -->
    <!-- ผูกค่า input กับ model → ข้อมูลจะ sync กันกับ parent component -->
    <!-- กำหนดให้เป็นช่องกรอกข้อความ -->
    <!-- ข้อความจางๆ โผล่มาในช่อง ตอนที่ยังไม่ได้พิมพ์ -->
    <input v-model="model" type="text" placeholder="ค้นหาเรื่อง, เนื้อหา" class="w-full border border-gray-400 rounded-lg px-3 py-2 
             focus:outline-none focus:ring-2 focus:ring-blue-400" />
  </div>
</template>
