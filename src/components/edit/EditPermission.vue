<template>
  <!-- 表单组件，使用 Ant Design Vue 的 Form Model -->
  <a-form-model ref="form" :model="formData" :rules="rules" layout="vertical">
    <!-- 权限名称输入框 -->
    <a-form-model-item label="权限名称" prop="label">
      <a-input v-model.trim="formData.label" placeholder="请输入权限名称" />
    </a-form-model-item>
    <!-- 权限类型选择框 -->
    <a-form-model-item label="权限类型" prop="type">
      <a-select
        v-model="formData.type"
        :options="permissionTypes"
        placeholder="请选择权限类型"
      />
    </a-form-model-item>
    <!-- 权限动作选择框 -->
    <a-form-model-item label="Action" prop="action">
      <a-select
        v-model="formData.action"
        allowClear
        placeholder="请选择权限动作"
        :options="actions"
      />
    </a-form-model-item>
  </a-form-model>
</template>


<script>
import { permissionTypes, actions } from '@/utils/const';  // 从 utils/const 模块中导入权限类型和动作

export default {
  name: 'EditPermission',  // 组件名称
  props: {
    data: {
      type: Object,  // 定义 data 属性的类型为对象
      default: null,  // 默认值为 null
    },
  },
  data() {
    return {
      permissionTypes,  // 权限类型选项
      actions,  // 权限动作选项
      formData: {
        type: undefined,  // 权限类型
        label: '',  // 权限名称
        action: undefined,  // 权限动作
      },
      rules: {
        type: { required: true, message: '请选择权限类型' },  // 权限类型验证规则
        label: { required: true, message: '请输入权限名称' },  // 权限名称验证规则
        action: { required: true, message: '请选择权限动作' },  // 权限动作验证规则
      },
    };
  },
  watch: {
    data: {
      immediate: true,  // 立即执行处理函数
      handler(data) {
        if (!data) return;  // 如果 data 为空，则返回
        this.formData = {
          type: data.type,  // 设置权限类型
          label: data.label,  // 设置权限名称
          action: data.action,  // 设置权限动作
        };
      },
    },
  },
  methods: {
    // 验证表单并返回表单数据
    validate() {
      return this.$refs.form.validate().then(() => this.formData);
    },
  },
};
</script>
