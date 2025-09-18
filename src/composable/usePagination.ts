// src/composable/usePagination.ts
// NEW: composable ช่วยจัดการหน้าปัจจุบัน

// นำเข้า reactive ตัวแปร (ref) และตัวแปรที่คำนวณอัตโนมัติ (computed) จาก Vue
import { computed, ref } from "vue";

// ประกาศฟังก์ชัน usePagination (เป็น composable function)
// เวลาอยากใช้ pagination ใน component ไหน ก็ import ไปใช้ได้เลย
export function usePagination() {
  // เก็บ "หน้าปัจจุบัน" ค่าเริ่มต้นเป็น 1
  const currentPage = ref(1);

  // เก็บ "จำนวนรายการต่อหน้า" ค่าเริ่มต้น 10
  const pageSize = ref(10);

  // เก็บจำนวนหน้าทั้งหมด (ค่า default = 1 จนกว่าจะ set ใหม่)
  const totalPages = ref(1);

  // เก็บจำนวนข้อมูลทั้งหมด (ค่า default = 0)
  const totalItems = ref(0);

  // เช็คว่าถอยกลับไปหน้า previous ได้ไหม (true ถ้า currentPage > 1)
  const canPrev = computed(() => currentPage.value > 1);

  const canNext = computed(() => currentPage.value < totalPages.value);
  // เช็คว่ากดไป next ได้ไหม (true ถ้า currentPage < totalPages)

  // ฟังก์ชันใช้ update ค่า meta ที่มาจาก API หรือข้อมูลที่ fetch มา
  function setMeta(meta: { totalPages: number; totalItems: number }) {
    totalPages.value = meta.totalPages;
    totalItems.value = meta.totalItems;
  }

  // return ออกไปให้ component ภายนอกใช้
  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    canPrev,
    canNext,
    setMeta,
  };
}
