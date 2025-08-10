<template>
    <div class="loading" v-if="visible">
        <a-spin :size="28" v-if="visible" />
    </div>
</template>
<script setup>
import { watch } from 'vue'
const emits = defineEmits(['update:visible'])
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    timer: {
        type: Number,
        default: 5000
    }
})

watch(() => props.visible, (val) => {
    setTimeout(() => {
        emits('update:visible', false)
    }, props.timer)
})

</script>
<style scoped>
.loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 666;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>