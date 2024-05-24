<template>
  <!-- 表单组件，使用 Ant Design Vue 的 Form Model 组件 -->
  <a-form-model ref="form" :model="formData" :rules="rules">
    <!-- 角色名称输入框 -->
    <a-form-model-item label="角色名称" prop="label">
      <a-input v-model.trim="formData.label" placeholder="请输入角色名称" />
    </a-form-model-item>
    <!-- 描述输入框 -->
    <a-form-model-item label="描述" prop="description">
      <a-input v-model.trim="formData.description" placeholder="请输入备注" />
    </a-form-model-item>
    <!-- 权限选择树 -->
    <a-form-model-item label="权限" prop="permissions">
      <!-- 加载状态显示 -->
      <a-spin v-if="loading" style="width: 100%" />
      <!-- 权限树 -->
      <a-tree
        v-else
        v-model="formData.permissions"
        checkable
        defaultExpandAll
        :tree-data="permissions"
        :replace-fields="{ key: 'value' }"
      />
    </a-form-model-item>
  </a-form-model>
</template>


<script>
import { groupBy } from 'lodash-es';  // 导入 lodash-es 中的 groupBy 函数，用于数据分组

export default {
  name: 'EditRole',  // 组件名称
  props: {
    data: {
      type: Object,  // 定义 data 属性的类型为对象
      default: null,  // 默认值为 null
    },
  },
  data() {
    return {
      permissions: [],  // 存储权限树数据
      loading: true,  // 加载状态
      formData: {
        label: '',  // 角色名称
        description: '',  // 角色描述
        permissions: [],  // 角色权限
      },
      rules: {
        label: { required: true, message: '请输入角色名称' },  // 角色名称验证规则
        permissions: { required: true, message: '请选择权限' },  // 权限验证规则
      },
    };
  },
  watch: {
    data: {
      immediate: true,  // 立即执行处理函数
      handler(data) {
        if (!data) return;
        this.formData = {
          label: data.label,  // 设置角色名称
          description: data.description,  // 设置角色描述
          permissions: data.permissions.map(i => i.id),  // 设置角色权限
        };
      },
    },
  },
  mounted() {
    this.loading = true;  // 开始加载
    this.$api.getPermissions()  // 获取权限列表
      .then(data => {
        this.initPermissions(data.data);  // 初始化权限数据
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '权限列表获取失败');  // 获取失败时显示错误信息
      }).finally(() => {
        this.loading = false;  // 结束加载
      });
  },
  methods: {
    // 初始化权限数据
    initPermissions(data) {
      const permissions = groupBy(data, 'type');  // 按权限类型分组
      const result = [];
      for (const [type, items] of Object.entries(permissions)) {
        result.push({
          title: type,  // 权限类型标题
          value: type,  // 权限类型值
          children: items.map(item => ({
            title: item.label,  // 权限项标题
            value: item.id,  // 权限项值
          })),
        });
      }
      this.permissions = result;  // 设置权限树数据
    },
    // 验证表单并返回表单数据
    validate() {
      return this.$refs.form.validate().then(() => ({
        ...this.formData,
        permissions: this.formData.permissions.filter(v => {
          return typeof v === 'number';  // 过滤出数字类型的权限值
        }),
      }));
    },
  },
};
</script>
