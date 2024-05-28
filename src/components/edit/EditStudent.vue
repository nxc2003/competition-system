<template>
  <!-- 表单组件，使用 Ant Design Vue 的 Form 组件 -->
  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :model="form"
    :rules="rules"
  >
    <!-- 学号输入框 -->
    <a-form-item label="学号" :rules="rules.sid">
      <a-input
        v-model="form.sid"
        :disabled="isEdit"
        placeholder="学号"
        allowClear
      >
        <template v-slot:prefix>
          <a-icon type="user" style="color: rgba(0,0,0,.25)" />
        </template>
      </a-input>
    </a-form-item>
    <!-- 密码输入框，仅在非编辑模式下显示 -->
    <a-form-item v-if="!isEdit" label="密码" :rules="rules.password">
      <a-input
        ref="password"
        v-model="form.password"
        placeholder="密码"
        allowClear
      >
        <template v-slot:prefix>
          <a-icon type="lock" style="color: rgba(0,0,0,.25)" />
        </template>
      </a-input>
    </a-form-item>
    <!-- 姓名输入框 -->
    <a-form-item label="姓名" :rules="rules.name">
      <a-input
        v-model="form.name"
        placeholder="姓名"
        allowClear
      />
    </a-form-item>
    <!-- 年级选择框 -->
    <a-form-item label="年级" :rules="rules.grade">
      <a-select
        v-model="form.grade"
        :options="grades"
        allowClear
        placeholder="年级"
      />
    </a-form-item>
    <!-- 班级输入框 -->
    <a-form-item label="班级" :rules="rules.class">
      <a-input
        v-model="form.class"
        placeholder="班级"
        allowClear
      />
    </a-form-item>
    <!-- 性别单选框组 -->
    <a-form-item label="性别" :rules="rules.sex">
      <a-radio-group v-model="form.sex" :options="sexes" />
    </a-form-item>
  </a-form>
</template>

<script>
import { pick } from 'lodash-es'; // 从 lodash-es 导入 pick 函数，用于选择对象属性
import { grades, sexes } from '@/utils/const'; // 从 utils/const 导入年级和性别选项
import EditMixin from './edit-mixin'; // 导入 EditMixin 混入，用于共享表单编辑逻辑

export default {
  name: 'EditStudent', // 组件名称
  mixins: [EditMixin], // 使用 EditMixin 混入
  data() {
    return {
      grades, // 年级选项数据
      decorator, // 表单装饰器
      sexes, // 性别选项数据
    };
  },
  methods: {
    // 初始化表单数据
    initData() {
      const { data } = this;
      const result = pick(data, ['sid', 'name', 'sex', 'class', 'grade']); // 选择需要的表单字段
      this.form.setFieldsValue(result); // 设置表单字段的值
    },
  },
};

/**
 * 定义表单装饰器
 */
const decorator = {
  sid: ['sid', {
    rules: [{
      required: true,
      message: '请输入账号！',
    }],
  }],
  password: ['password', {
    rules: [{
      required: true,
      message: '请输入密码！',
    }],
  }],
  name: ['name', {
    rules: [{
      required: true,
      message: '请输入姓名！',
    }],
  }],
  sex: ['sex', {
    initialValue: 1, // 初始值为 1
  }],
  class: ['class', {
    rules: [{
      required: true,
      message: '请输入班级！',
    }],
  }],
  grade: ['grade', {
    rules: [{
      required: true,
      message: '请选择年级！',
    }],
  }],
};
</script>
