<template>
  <!-- 表单模型, 绑定数据模型和验证规则 -->
  <a-form-model
    ref="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 20 }"
    :model="formData"
    :rules="rules"
  >
    <!-- 表单项：成绩 -->
    <a-form-model-item label="成绩" prop="score">
      <a-input
        v-model="formData.score"
        placeholder="比赛成绩,报名不填"
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
        @focus="onSearch('')"
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
        // 如果成绩字段可以为空，去掉 required 验证规则
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
      this.loading = true;
      this.$api.getUserList({
        type: 'teacher',
        name: query,
        offset: 1,
        limit: 10,
      }).then(response => {
        console.log('API response:', response); // 输出调试信息
        this.teachers = response.data.map(item => ({
          label: `(${item.tid})${item.name}`,
          value: item.tid,
        }));
        console.log('Mapped teachers:', this.teachers); // 输出调试信息
      }).catch(e => {
        this.$message.error(e.msg || '查询失败');
      }).finally(() => {
        this.loading = false;
      });
    }, 300),
  },
};
</script>
