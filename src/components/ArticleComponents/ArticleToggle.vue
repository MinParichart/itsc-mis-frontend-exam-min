<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit  = defineEmits<{'update:modelValue':[boolean]}>()

const toggle = () => emit('update:modelValue', !props.modelValue)
</script>

<template>
  <div
    class="w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer"
    :class="modelValue ? 'bg-blue-500' : 'bg-gray-300'"
    @click="toggle"
  >
    <div
      class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
      :class="{ 'translate-x-5': modelValue }"
    />
  </div>
</template>
