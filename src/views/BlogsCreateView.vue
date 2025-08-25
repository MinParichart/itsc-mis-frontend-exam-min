<script setup lang="ts">
import CreateForm from '@/components/BlogsCreateComponents/CreateForm.vue';
import NavbarForAll from '@/components/NavbarForAll.vue';
</script>

<template>
  <NavbarForAll />  <!-- แถบน้ำเงินด้านบน -->
  <div class="container mx-auto my-6 px-4">
    <CreateForm />   <!-- ฟอร์ม POST /blogs -->
  </div>
</template>