<template>
  <div class="container">
    <a-descriptions
      :title="`赛事详情：${race.title}`"
      style="padding: 10px"
    >
      <a-descriptions-item label="主办方">
        {{ race.sponsor }}
      </a-descriptions-item>
      <a-descriptions-item label="类别">
        {{ race.type }}
      </a-descriptions-item>
      <a-descriptions-item label="级别">
        {{ race.level }}
      </a-descriptions-item>
      <a-descriptions-item label="时间">
        {{ formatDate(race.date) }}
      </a-descriptions-item>
      <a-descriptions-item label="地点">
        {{ race.location }}
      </a-descriptions-item>
      <br>
      <a-descriptions-item label="描述">
        {{ race.description }}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import dayjs from 'dayjs'; // 引入dayjs库

export default {
  name: 'Detail', // 组件名称
  props: {
    race: {
      type: Object, // race属性是一个对象
      required: true, // 该属性是必需的
    },
    records: {
      type: Array, // records属性是一个数组
      required: true, // 该属性是必需的
    },
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD'); // 格式化日期为'YYYY-MM-DD'格式
    },
  },
};
</script>
