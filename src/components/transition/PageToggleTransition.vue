<template>
  <transition :enter-active-class="`animate__animated animate__${name}`">
    <slot />
  </transition>
</template>

<script>
export default {
  name: 'PageToggleTransition', // 组件名称
  props: {
    name: String, // 传递动画名称
  },
};
</script>
