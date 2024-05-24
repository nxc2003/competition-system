<template>
  <div class="container">
    <UserLogin class="login" />
  </div>
</template>

<script>
import UserLogin from '@/components/common/UserLogin.vue'; // 引入UserLogin组件

export default {
  name: 'Login', // 组件名称
  components: { UserLogin }, // 注册UserLogin组件
  metaInfo: {
    title: '登录', // 页面标题
  },
};
</script>

<style scoped lang="stylus">
.container
  height 100vh // 设置容器高度为视口高度的100%
  background #f0f2f5 url('~@/assets/bg.svg') repeat // 设置背景颜色和图片
  .login
    center() // 居中显示登录组件
</style>
