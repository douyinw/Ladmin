<template>
   <div style="text-align: center;">待开发</div>
</template>
<script setup>
import { ref } from 'vue'

const emits = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
    modelValue: { type: Array, default: () => [] },
})

</script>
<style scoped lang="scss"></style>