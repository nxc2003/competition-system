<template>
  <!-- 表单模型, 绑定数据模型和验证规则 -->
  <a-form-model
    ref="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 20 }"
    :model="formData"
    :rules="rules"
  >
    <!-- 表单项：成绩, 自动聚焦 -->
    <a-form-model-item label="成绩" prop="score">
      <a-input
        v-model="formData.score"
        placeholder="比赛成绩"
        auto-focus
      />
    </a-form-model-item>
    <!-- 表单项：导师选择器, 支持搜索和清除 -->
    <a-form-model-item label="导师" prop="tid">
      <a-select
        v-model="formData.tid"
        show-search
        allow-clear
        placeholder="请选择导师，没有可不填"
        :filter-option="false"
        :show-arrow="false"
        :options="teachers"
        @search="onSearch"
      >
        <!-- 加载中的旋转图标, 使用 v-slot 替换旧的 slot 用法 -->
        <template v-slot:notFoundContent>
          <a-spin
            v-if="loading"
            size="small"
            style="width: 100%; height: 100px; line-height: 100px"
          />
        </template>
      </a-select>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { debounce } from 'lodash-es';

export default {
  name: 'AddRecord',
  data() {
    return {
      // 教师列表
      teachers: [],
      // 加载状态
      loading: false,
      // 表单数据
      formData: {
        score: '',
        tid: undefined,
      },
      // 表单验证规则
      rules: {
        score: { required: true, message: '请输入比赛成绩' },
      },
    };
  },
  methods: {
    // 验证表单
    validate() {
      return this.$refs.form.validate().then(() => this.formData);
    },
    // 搜索导师
    onSearch: debounce(function(query) {
      if (!query) return;
      this.loading = true;
      this.$api.getUserList({
        type: 'teacher',
        name: query,
        offset: 1,
        limit: 10,
      }).then(data => {
        this.teachers = data.data.map(item => ({
          label: `(${item.tid})${item.name}`,
          value: item.tid,
        }));
      }).catch(e => {
        this.$message.error(e.msg || '查询失败');
      }).finally(() => {
        this.loading = false;
      });
    }, 300),
  },
};
</script>
