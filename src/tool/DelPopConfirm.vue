<template>
    <!--旧的监听：v-on="$listeners"-->
  <a-popconfirm
    @confirm="onConfirm"
    @cancel="onCancel"
    v-bind="props"
  >
    <template #icon>
      <a-icon
        type="question-circle-o"
        style="color: orange"
      />
    </template>
    <a>
      <slot>
        <a-icon type="delete" />
      </slot>
    </a>
  </a-popconfirm>
</template>

<script>
export default {
  name: 'DelPopConfirm', // 组件名称
  computed: {
    props() {
      return {
        title: '确认删除？', // 默认提示信息
        placement: 'left', // 默认弹出位置为左侧
        ...this.$attrs, // 合并父组件传递的属性
      };
    },
  },
};
</script>
