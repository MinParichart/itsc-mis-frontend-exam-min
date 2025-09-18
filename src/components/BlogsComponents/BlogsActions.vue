<script setup lang="ts">
import { ListBulletIcon, PencilSquareIcon } from "@heroicons/vue/24/solid";

// defineProps → รับค่าจาก parent component
const props = defineProps<{
  active: boolean; // บอกว่าสถานะตอนนี้คือ เผยแพร่ หรือ ซ่อน
  pin?: boolean; // true/false ว่าปักหมุดหรือยัง (ไม่บังคับส่งมา)
}>();

// defineEmits → ประกาศ event ที่ component จะส่งออกไปให้ parent
const emit = defineEmits<{
  "update:active": [boolean]; // ใช้เวลา toggle ซ่อน/เผยแพร่
  view: []; // ดูรายละเอียด
  edit: []; // แก้ไข
  delete: []; // ลบ
  pin: []; // ปักหมุด
}>();
</script>

<template>
  <!-- กล่องหลัก จัดเรียงแนวตั้ง + ชิดขวา และเว้นช่องว่างแนวตั้ง 8px (gap-2) flex flex-col items-end gap-2 -->
  <div class="flex flex-col items-end gap-2">
    <!-- แถวบน: Pin + Toggle + สถานะ -->
    <div class="flex items-center gap-2">
      <button :class=" // : = ผูกค่า (bind) จาก JavaScript → เข้าไปใน attribute ของ HTML ตัวอย่างนี้ผูก class ของปุ่มให้เปลี่ยนตามค่า props.pin
        props.pin
          ? 'p-2 rounded bg-blue-500 text-white hover:bg-blue-600' // props.pin === true ถ้าปักหมุดแล้ว → สีฟ้าเข้ม ตัวอักษรขาว
            : 'p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200' // props.pin === false ถ้ายังไม่ปัก → ฟ้าอ่อน ตัวอักษรฟ้า
        " :aria-pressed="props.pin ? 'true' : 'false'" title="ปักหมุด" @click="$emit('pin')">
        <!-- 
      aria-pressed เป็น Attribute ของ HTML (ใช้ช่วยให้เครื่องมือช่วยเหลือ เช่น screen reader เข้าใจว่าปุ่มนี้ “กดอยู่” หรือ “ยังไม่กด”)
      เรา bind ค่าเหมือนกับ class เลย → ถ้า pin=true จะได้ "true" ถ้าไม่ จะได้ "false"

      @ = shorthand ของ v-on: ใช้สำหรับฟัง event - @click="..." = เมื่อมีการกดปุ่ม (click) ให้ทำสิ่งนี้ 
      สั่ง ส่ง event ชื่อ "pin" ออกไปให้ parent component
      Child component (ปุ่มนี้) ไม่ได้จัดการเอง → ให้ parent ไปตัดสินใจว่าจะทำอะไร
      -->
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
