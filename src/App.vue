<template>
  <!-- 根元素，应用的挂载点 -->
  <div id="app">
    <!-- 路由视图组件，用于渲染匹配的路由组件 -->
    <router-view />
    <!-- 加载组件，绑定 `loading` 状态 -->
    <Loading :loading="loading" />
  </div>
</template>

<script>
// 导入 Loading 组件
import Loading from './components/common/Loading';

export default {
  name: 'Root',
  components: { Loading },
  provide() {
    // 提供 `loadingStart` 和 `loadingEnd` 方法给子组件使用
    return {
      loadingStart: this.loadingStart,
      loadingEnd: this.loadingEnd,
    };
  },
  data() {
    // 定义组件的数据，初始值为 `loading: false`
    return {
      loading: false,
    };
  },
  methods: {
    // 将 `loading` 设置为 `true`，显示加载动画
    loadingStart() {
      this.loading = true;
    },
    // 将 `loading` 设置为 `false`，隐藏加载动画
    loadingEnd() {
      this.loading = false;
    },
  },
  metaInfo: {
    // 页面标题
    title: '首页',
    // 标题模板
    titleTemplate: '%s | 竞赛管理系统',
    // Meta 标签
    meta: [
      {
        // 页面关键词
        name: 'keywords',
        content: '重庆邮电大学,计算机,竞赛,管理系统',
      },
      {
        // 页面描述
        name: 'description',
        content: '重庆邮电大学计算机学院竞赛管理系统，用于管理竞赛数据。学生参赛报备、竞赛数据统计、数据导出。',
      },
    ],
  },
};
</script>

<style lang="stylus">
#app
  // 设置字体和颜色
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50

::-webkit-scrollbar
  // 设置滚动条宽度和高度
  width 5px
  height 5px
  cursor pointer

::-webkit-scrollbar-thumb
  // 设置滚动条滑块的样式
  border-radius 5px
  -webkit-box-shadow inset 0 0 5px rgba(0, 0, 0, 0.2)
  background #e0e5eb

::-webkit-scrollbar-track
  // 设置滚动条轨道的样式
  box-shadow inset 0 0 5px rgba(0, 0, 0, 0.1)
  border-radius 0
</style>
