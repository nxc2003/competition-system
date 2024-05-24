<template>
  <!-- 表单模型 -->
  <a-form-model
    ref="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 20 }"
    :model="formData"
    :rules="rules"
  >
    <!-- 表单项：审核 -->
    <a-form-model-item label="审核" prop="status">
      <a-radio-group v-model="formData.status">
        <a-radio-button :value="1">通过</a-radio-button>
        <a-radio-button :value="2">拒绝</a-radio-button>
      </a-radio-group>
    </a-form-model-item>
    <!-- 表单项：备注 -->
    <a-form-model-item label="备注" prop="description">
      <a-input
        v-model="formData.description"
        placeholder="请输入备注"
        auto-focus
      />
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'AuditRecord', // 组件名称
  props: {
    record: {
      type: Object,
      required: true, // 必需传递
    },
  },
  data() {
    return {
      formData: {
        status: 1, // 初始状态为通过
        description: '', // 备注初始为空
      },
    };
  },
  computed: {
    rules() {
      return {
        status: { required: true, message: '请选择审核结果' }, // 审核结果为必填项
        description: {
          required: this.formData.status === 2, // 拒绝时备注为必填项
          message: '请填写备注',
        },
      };
    },
  },
  watch: {
    record: {
      immediate: true,
      handler(value) {
        Object.assign(this.formData, {
          status: value.status, // 初始化时设置审核状态
          description: value.description, // 初始化时设置备注
        });
      },
    },
    'formData.status'() {
      this.formData.description = ''; // 切换审核状态时清空备注
    },
  },
  methods: {
    validate() {
      return this.$refs.form.validate().then(() => this.formData); // 验证表单
    },
  },
};
</script>
