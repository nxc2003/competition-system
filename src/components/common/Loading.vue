<template>
  <!-- transition 组件，用于实现淡入淡出效果 -->
  <transition name="fade">
    <!-- 当 loading 为 true 时显示 loading 动画 -->
    <div
      v-if="loading"
      class="loading"
    >
      <!-- 加载动画的具体实现 -->
      <div id="loader" />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Loading',  // 组件名称
  props: {
    loading: {  // 控制加载动画显示的布尔值
      type: Boolean,
      default: true,  // 默认值为 true
    },
  },
};
</script>
<style lang="stylus" scoped>
  /* 定义 fade 过渡效果的进入和离开状态 */
  .fade-enter, .fade-leave-to {
    opacity: 0;  // 透明度为 0
  }
  /* 定义 fade 过渡效果的过渡状态 */
  .fade-enter-active, .fade-leave-active {
    transition: all .5s ease;  // 所有属性过渡，持续时间 0.5 秒，缓和效果
  }
  /* loading 容器的样式 */
  .loading {
    display: block;  // 显示为块级元素
    position: absolute;  // 绝对定位
    top: 0;  // 距顶部 0
    left: 0;  // 距左侧 0
    z-index: 999999;  // 层级最高
    height: 100%;  // 高度 100%
    width: 100%;  // 宽度 100%
    background-color: rgba(250, 250, 250, 0.9);  // 背景颜色，白色，透明度 0.9
  }
  /* 加载动画的样式 */
  #loader {
    display: block;  // 显示为块级元素
    position: relative;  // 相对定位
    left: 50%;  // 左侧 50%
    top: 50%;  // 顶部 50%
    width: 150px;  // 宽度 150px
    height: 150px;  // 高度 150px
    margin: -75px 0 0 -75px;  // 外边距，确保居中
    border-radius: 50%;  // 圆角边框，形成圆形
    border: 3px solid transparent;  // 边框为透明
    border-top-color: #ff5a5a;  // 边框顶部颜色为红色
    animation: spin 1s linear infinite;  // 旋转动画，持续 1 秒，无限循环
  }
  /* loader 的 before 伪元素样式 */
  #loader:before {
    content: "";  // 内容为空
