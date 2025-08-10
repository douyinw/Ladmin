<template>
  <a-row class="container" :wrap="false" align="start">

    <a-col :span="18" class="left-side">


      <a-card :title="`欢迎回来！ ${userStore.info.username}`">
        <a-row style="padding: 10px;">

          <template v-for="(item,index) in total">
            <a-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
              <a-space>
                <a-avatar :size="50" style="margin-right: 12px;">
                  <img v-if="index===0" src="@/assets/icon/n1.svg" />
                  <img v-else-if="index===1" src="@/assets/icon/n3.svg" />
                  <img v-else-if="index===2" src="@/assets/icon/user.svg" style="width: 38px;padding: 0 6px;" />
                  <img v-else src="@/assets/icon/n3.svg" />
                </a-avatar>
                <a-statistic :title="item.title" :value="item.value" show-group-separator>
                  <template #suffix>
                    <span class="unit">{{ item.suffix }}</span>
                  </template>
                </a-statistic>
              </a-space>
            </a-col>
          </template>
        </a-row>

        <a-row class="card" style="margin-top: 20px;" :wrap="false" align="start">
          <a-col :span="12" style="flex: 1;margin: 0;">
            <a-card title="内容数据" style="border: 0;">
              <template #extra>
                <a-link>查看更多</a-link>
              </template>
              <ai-chart :option="hao" />
            </a-card>
          </a-col>
          <a-col :span="12" style="margin: 0 0 0 16px;flex: 1;">
            <a-card title="用户数据" style="border: 0;">
              <template #extra>
                <a-link>查看更多</a-link>
              </template>
              <ai-chart :option="user" />
            </a-card>
          </a-col>
        </a-row>

      </a-card>


      <a-row class="card" style="margin-top: 14px;" :wrap="false" align="start">
        <a-col :span="12" style="margin: 0;flex: 1;">
          <a-card title="线上热门内容">
            <template #extra>
              <a-link>查看更多</a-link>
            </template>
          </a-card>
        </a-col>
        <a-col :span="12" style="margin: 0 0 0 16px;flex: 1;">
          <a-card title="内容类型占比">
            <ai-chart :option="option" />
          </a-card>
        </a-col>
      </a-row>

    </a-col>

    <a-col :span="6" class="right-side">
      <a-space direction="vertical" :size="14">
        <a-card title="快捷操作">
          <template #extra>
            <a-link>管理</a-link>
          </template>
        </a-card>

        <a-card class="card" title="公告">
          <template #extra>
            <a-link>查看更多</a-link>
          </template>
        </a-card>
      </a-space>
    </a-col>

  </a-row>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store'
import aiChart from '@/components/ai-chart/chart.vue'

const userStore = useUserStore()

const total = reactive([{
  title: '线上总内容',
  value: 0,
  suffix: '条',
}, {
  title: '线上总评论',
  value: 0,
  suffix: '条',
},
{
  title: '线上总用户',
  value: 0,
  suffix: '个',
}, {
  title: '线上总消息',
  value: 0,
  suffix: '条',
},
])


const hao = ref({
  grid: {
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    containLabel: true
  },

  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      smooth: true
    }
  ]

})

// 统计
const user = {
  grid: {
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      itemStyle: {
        color: '#AD6EF4'
      },
    }
  ]
}


const option = {

  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      data: [
        { value: 1048, name: '文章' },
        { value: 735, name: '图文' },
        { value: 580, name: '视频' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};



</script>
<style lang="scss" scoped>
.container {
  height: 100%;
}

.left-side {

  flex: 1;
  min-width: 280px;
  height: 100%;
  overflow: hidden auto;
}

.right-side {
  max-width: 280px;
  height: 100%;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
}


.arco-card-bordered {
  border-width: 0;
}

/* .card :deep(.arco-card-header) {
  border: none;
} */

.card {
  .arco-col {
    margin-bottom: 12px;
  }
}

.arco-avatar {
  background-color: var(--color-fill-2);
}

.unit {
  margin-left: 8px;
  color: rgb(var(--gray-8));
  font-size: 12px;
}

[mine-skin=skin_a],
[mine-skin=skin_b],
[mine-skin=skin_c],
[mine-skin=skin_d],
[mine-skin=skin_e],
[mine-skin=skin_f] {
  .container {
    margin: 12px;
  }

  .arco-card-bordered {
    border-width: 1px;
  }
}
</style>
