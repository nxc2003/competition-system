<template>
  <!-- 使用Ant Design Vue的Result组件来显示404页面 -->
  <a-result
    status="404"
    title="404 - Page Not Found"
    sub-title="Sorry, the page you visited does not exist."
    >
    <template #extra>
      <a-button
        type="primary"
        @click="$router.back()"
      >
        Back <!-- 按钮文本为返回 -->
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'NotFound404',
};
</script>
