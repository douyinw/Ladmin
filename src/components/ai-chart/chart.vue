<template>
    <div ref="chartRef" :style="{ height: height, width: width }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
    option: { type: Object, default: () => { } },
    width: { type: String, default: '100%' },
    height: { type: String, default: '280px' },
})

// 响应式图表实例
const chartRef = ref(null);
let chartInstance = null;

// 初始化图表
const initChart = () => {
    if (!chartRef.value) return;

    // 销毁旧实例（如果存在）
    if (chartInstance) {
        chartInstance.dispose();
    }

    // 创建新实例
    chartInstance = echarts.init(chartRef.value);

    // 设置图表配置
    chartInstance.setOption(props.option);

};

// 响应窗口大小变化
const handleResize = () => {
    if (chartInstance) {
        chartInstance.resize();
    }
};

onMounted(() => {
    nextTick(() => {
        initChart();
    });
});

// 组件卸载前清理
onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
});

const resizeObserver = new ResizeObserver(() => {
    handleResize();
});

watch(chartRef, (el) => {
    if (el) resizeObserver.observe(el);
}, { immediate: true });

</script>