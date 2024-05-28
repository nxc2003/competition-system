<template>
  <!-- 使用 a-form-model 组件，绑定表单数据为 formData -->
  <a-form-model :model="formData">
    <!-- 表单项，绑定到 formData.role_id，具有必填验证 -->
    <a-form-model-item
      required
      label="当前角色"
      prop="role_id"
      :rules="{ required: true, message: '请选择目标角色' }"
    >
      <!-- 下拉选择框，绑定到 formData.role_id，选项来自 options -->
      <a-select
        v-model="formData.role_id"
        :options="options"
        placeholder="请选择目标角色"
      />
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'GrantRole', // 组件名称
  props: {
    type: { // 用户类型
      type: String,
      required: true,
    },
    account: { // 用户账号
      type: String,
      required: true,
    },
    role: { // 当前角色 ID
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      options: [], // 角色选项数组
      formData: {
        role_id: this.role, // 表单数据，初始角色 ID 来自 prop
      },
    };
  },
  watch: {
    role: { // 监听角色 ID 的变化
      immediate: true, // 立即执行监听器
      handler(role) {
        this.formData.role_id = role; // 更新表单数据中的角色 ID
      },
    },
  },
  mounted() {
    // 组件挂载时获取角色列表
    this.$api.getRoles({
      offset: 1,
      limit: 100,
    }).then(data => {
      // 将获取的角色数据映射为选项格式
      this.options = data.data.map(v => ({
        label: v.label,
        value: v.id,
      }));
    }).catch(e => {
      // 处理获取角色列表失败的情况
      this.$message.error(e.msg || '获取角色列表失败');
    });
  },
  methods: {
    async confirm() {
      // 如果角色没有变化则不做任何操作
      if (this.role === this.formData.role_id) return;
      try {
        // 调用 API 授权角色
        await this.$api.grantRole({
          type: this.type,
          account: this.account,
          role_id: this.formData.role_id,
        });
      } catch (e) {
        // 处理授权失败的情况
        this.$message.error(e.msg || '授权失败');
        throw e; // 抛出错误以便调用者处理
      }
    },
  },
};
</script>
