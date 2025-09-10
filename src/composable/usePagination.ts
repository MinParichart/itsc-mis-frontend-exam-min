// src/composable/usePagination.ts
// NEW: composable ช่วยจัดการหน้าปัจจุบัน

import { ref, computed } from "vue";

export function usePagination() {
  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalPages = ref(1);
  const totalItems = ref(0);

  const canPrev = computed(() => currentPage.value > 1);
  const canNext = computed(() => currentPage.value < totalPages.value);

  function setMeta(meta: { totalPages: number; totalItems: number }) {
    totalPages.value = meta.totalPages;
    totalItems.value = meta.totalItems;
  }

  return { currentPage, pageSize, totalPages, totalItems, canPrev, canNext, setMeta };
}
