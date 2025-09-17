<script setup lang="ts">
import BreadcrumbBar from "@/components/BlogsComponents/BreadcrumbBar.vue";
import NavbarForAll from "@/components/BlogsComponents/NavbarForAll.vue";
import BlogsList from "@/components/BlogsList.vue";

import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from "vue-router";

const route = useRoute();
const detailTitle = ref("");
const listRef = ref<InstanceType<typeof BlogsList> | null>(null)

// มี id ไหม (โหมดรายละเอียด)
const hasId = computed(() => !!route.params.id);

// ถ้าเปลี่ยนเส้นทางกลับหน้า list ให้เคลียร์ชื่อ
onMounted(()=>{ listRef.value?.refresh?.() })

watch(
  () => route.params.id,
  () => {
    if (!route.params.id) detailTitle.value = "";
  }
);

</script>

<template>
  <NavbarForAll :show-logout="true">
    <template #left>
      <BreadcrumbBar>
        <!-- ถ้าอยู่หน้า detail ให้ "บทความ" เป็นลิงก์กลับ /blogs -->
        <RouterLink
          v-if="hasId"
          to="/blogs"
          class="font-semibold hover:underline"
          >บทความ</RouterLink
        >
        <span v-else class="font-semibold">บทความ</span>

        <template v-if="hasId">
          <span class="opacity-70">/</span>
          <span class="font-semibold truncate max-w-[60vw]">{{
            detailTitle || "รายละเอียดบทความ"
          }}</span>
        </template>
      </BreadcrumbBar>
    </template>
  </NavbarForAll>

  <!-- BlogsList จะ emit ชื่อเรื่องขึ้นมาใช้ทำ breadcrumb -->
  <BlogsList ref="listRef" @detail-title="detailTitle = $event" />
</template>
