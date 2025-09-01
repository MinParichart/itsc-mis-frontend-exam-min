<script setup lang="ts">
import { ListBulletIcon, PencilSquareIcon } from "@heroicons/vue/24/solid";

// กำหนดชนิดของพร็อพที่ component นี้ “รับเข้ามา” จากพาเรนต์
const props = defineProps<{
  active: boolean;
  pin?: boolean
}>();

// ประกาศอีเวนต์ที่ component นี้ “ยิงออกไป” ให้พาเรนต์รับ
const emit = defineEmits<{
  "update:active": [boolean];
  view: [];
  edit: [];
  delete: [];
  pin: [];
}>();
</script>

<template>
  <!-- กล่องหลัก จัดเรียงแนวตั้ง + ชิดขวา และเว้นช่องว่างแนวตั้ง 8px (gap-2) flex flex-col items-end gap-2 -->
  <div class="flex flex-col items-end gap-2">
    <!-- แถวบน: Pin + Toggle + สถานะ -->
    <div class="flex items-center gap-2">
      <!-- ปักหมุด : Pin -->
      <!-- :aria-pressed ใช้บอก “สถานะกดค้าง/เปิด-ปิด” ของปุ่มแบบ toggle button ให้กับโปรแกรมช่วยอ่านหน้าจอ (screen reader) -->
      <!-- title="ปักหมุด" ข้อความ tooltip ที่จะแสดงเวลาเอาเมาส์ชี้ปุ่ม -->
      <!-- @click="$emit('pin')" เมื่อคลิกปุ่ม จะ ส่งอีเวนต์ชื่อ pin ออกไปให้พาเรนต์  ตัวปุ่มเองไม่เปลี่ยนสถานะ; แค่แจ้งพาเรนต์ว่า “ผู้ใช้กดปักหมุดแล้วนะ” พาเรนต์ต้องเป็นคนจัดการต่อ เช่น toggle ค่า, call API แล้วอัปเดต prop pin-->
      <button :class="props.pin
          ? 'p-2 rounded bg-blue-500 text-white hover:bg-blue-600' // ถ้าปักหมุดแล้ว → สีฟ้าเข้ม ตัวอักษรขาว
          : 'p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200' // ถ้ายังไม่ปัก → ฟ้าอ่อน ตัวอักษรฟ้า
        " :aria-pressed="props.pin ? 'true' : 'false'" title="ปักหมุด" @click="$emit('pin')">
        📌
      </button>

      <!-- Toggle + สถานะ -->
      <label class="flex items-center cursor-pointer gap-2">
        <!-- Toggle -->
        <input type="checkbox" class="hidden" :checked="props.active" @change="$emit('update:active', !props.active)" />
        <!-- capsale -->
        <div class="w-10 h-5 rounded-full relative transition-colors"
          :class="props.active ? 'bg-blue-500' : 'bg-gray-300'">
          <!-- จุดขาวสำหรับเลื่อน -->
          <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
            :class="{ 'translate-x-5': props.active }" />
        </div>
        <!-- แสดงข้อความ เผยแพร่/ซ่อน -->
        <span class="text-sm font-medium" :class="props.active ? 'text-green-600' : 'text-gray-500'">
          {{ props.active ? "เผยแพร่" : "ซ่อน" }}
        </span>
      </label>
    </div>

    <!-- แถวล่าง: vuew / Edit / Delete -->
    <div class="flex items-center gap-2">
      <!-- ปุ่ม view : ListBulletIcon -->
      <button class="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" title="ดูรายละเอียด"
        @click="$emit('view')">
        <ListBulletIcon class="w-4 h-4" />
      </button>
      <!-- ปุ่ม edit : PencilSquareIcon -->
      <button class="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200" title="แก้ไข"
        @click="$emit('edit')">
        <PencilSquareIcon class="w-4 h-4" />
      </button>
      <!-- ปุ่ม delete : แสดงเสมอ แต่ปิดการกดเมื่อยังเผยแพร่ -->
      <button :disabled="props.active" class="p-2 rounded transition-colors" :class="props.active
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-red-100 text-red-600 hover:bg-red-200'
        " :title="props.active ? 'ซ่อนเพื่อลบ' : 'ลบ'" @click="!props.active && $emit('delete')">
        🗑
      </button>
    </div>
  </div>
</template>
