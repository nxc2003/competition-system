<template>
  <div>
    <a-button style="float: right" @click="init">
      刷新
    </a-button>
    <Detail :race="race" :records="records"/>
    <Loading :loading="loading" />
  </div>
</template>

<script>
import { getRaceList, getRecordList } from '../../api'; // 从API模块中引入获取比赛列表和记录列表的方法
import Detail from './Detail'; // 引入Detail组件
import Loading from '../common/Loading'; // 引入Loading组件

export default {
  name: 'RaceDetail', // 组件名称
  components: { Loading, Detail }, // 注册组件
  props: {
    id: {
      type: String, // id属性类型为字符串
      required: true, // id属性是必需的
    },
    type: {
      type: String, // type属性类型为字符串
      required: true, // type属性是必需的
      validator(value) {
        return ['admin', 'teacher'].includes(value); // 验证type属性值是否为'admin'或'teacher'
      },
    },
  },
  data() {
    return {
      loading: false, // 加载状态
      race: {}, // 比赛详情
      records: [], // 比赛记录
    };
  },
  mounted() {
    this.init(); // 组件挂载时初始化数据
  },
  methods: {
    init() {
      if (this.loading) return; // 如果正在加载，则返回
      this.loading = true; // 设置加载状态为true
      const { id } = this; // 获取比赛ID
      const { account } = this.$store.state.user; // 获取当前用户账号
      Promise.all([
        getRaceList({ _id: id }), // 获取比赛列表
        this.type === 'teacher'
          ? getRecordList({ id, tid: account }) // 如果类型为'teacher'，则获取指定老师的记录
          : getRecordList({ id }), // 否则，获取所有记录
      ]).then(([
        { data: races }, // 解析获取的比赛列表数据
        { data: records }, // 解析获取的记录列表数据
      ]) => {
        this.race = races[0]; // 设置比赛详情
        this.records = records; // 设置比赛记录
      }).finally(() => {
        this.loading = false; // 设置加载状态为false
      });
    },
  },
};
</script>

<style scoped>

</style>
