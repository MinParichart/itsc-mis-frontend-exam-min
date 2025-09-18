<script setup lang="ts"></script>
<!-- 
script setup ว่างๆ แปลว่า component นี้ไม่ต้องมี logic อะไร 
(ไม่มี props, state, หรือ function พิเศษ) → ใช้แค่ template อย่างเดียว
-->

<template>
  <nav class="flex items-center gap-2 text-white">
    <slot />
    <!-- 
    <slot /> = placeholder → เอาไว้ให้ parent ส่ง content เข้ามาแทรก
    เช่น parent ใส่ <BreadcrumbBar><a>หน้าแรก</a></BreadcrumbBar>
    → <a>หน้าแรก</a> จะมาแสดงตรงนี้
    -->
  </nav>
</template>
