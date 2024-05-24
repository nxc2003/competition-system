<template>
  <div>
    <!-- 显示成功和失败用户数量的统计信息 -->
    <div style="margin-bottom: 20px">
      <!-- 成功用户数量，绿色显示 -->
      <span style="color: limegreen">
        <a-icon type="check-circle" />  <!-- 成功图标 -->
        <span>成功 {{ users.length - fail.length }} 人</span>  <!-- 显示成功用户数量 -->
      </span>
      <a-divider type="vertical" />  <!-- 垂直分隔线 -->
      <!-- 失败用户数量，红色显示 -->
      <span style="color: red">
        <a-icon type="exclamation-circle" />  <!-- 失败图标 -->
        <span>失败 {{ fail.length }} 人</span>  <!-- 显示失败用户数量 -->
      </span>
    </div>
    <!-- 显示失败详情 -->
    <span>失败详情：</span>
    <a-divider style="margin: 5px 0 10px 0" />  <!-- 分隔线 -->
    <!-- 使用 a-list 组件显示失败用户列表 -->
    <a-list
      size="small"
      :grid="{ gutter: 16, column: 3 }"  
      :data-source="fail"
      :pagination="{
        pageSize: 12,
        simple: true,
      }"
    >
      <!-- 定义列表项的渲染方式 -->
      <template #renderItem="item">
        <a-list-item>
          <!-- 使用 a-tag 组件显示失败用户的名称和主键 -->
          <a-tag>{{ item.name }}({{ item[primaryKey] }})</a-tag>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>


<script>
export default {
  name: 'DisplayFailedUser',  // 组件名称
  props: {
    primaryKey: {  // 主键属性，用于标识用户的唯一键
      type: String,
      required: true,
      validator: value => ['sid', 'tid'].includes(value),  // 验证主键值是否合法，只能是 'sid' 或 'tid'
    },
    users: {  // 用户列表
      type: Array,
      required: true,
    },
    fail: {  // 失败用户列表
      type: Array,
      required: true,
    },
  },
};
</script>
