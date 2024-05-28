<template>
  <header>
    <!-- 左侧的 header 区域 -->
    <div class="header-left"></div>
    <!-- 右侧的 header 区域 -->
    <div class="header-right">
      <!-- 显示登录状态的组件 -->
      <LoginState class="header-item" />
    </div>
  </header>
</template>

<script>
import LoginState from '@/components/common/LoginState'; // 导入 LoginState 组件

export default {
  name: 'Header', // 组件名称
  components: { LoginState }, // 注册 LoginState 组件
};
</script>

<style scoped lang="stylus">
header
  padding 0 10px  // 设置 header 内边距
  display flex  // 使用 Flex 布局
  justify-content space-between  // 子元素在主轴（水平轴）上的对齐方式为两端对齐
  & > div[class^=header]
    flex-grow 1  // 子元素在剩余空间中均分

.header-right
  text-align right  // 子元素文本右对齐

.header-item:hover
  background-color rgba(0, 0, 0, 0.025)  // 当鼠标悬停时，背景颜色变为浅灰色
</style>
