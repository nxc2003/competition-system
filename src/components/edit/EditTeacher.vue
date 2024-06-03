<template>
  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :form="form"
  >
    <!-- 工号输入框 -->
    <a-form-item label="工号">
      <a-input
        v-decorator="decorator.tid"
        :disabled="isEdit"
        placeholder="工号"
        allowClear
      >
        <a-icon
          slot="prefix"
          type="user"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input>
    </a-form-item>
    <!-- 密码输入框，仅在非编辑模式下显示 -->
    <a-form-item v-if="!isEdit" label="密码">
      <a-input-password
        v-decorator="decorator.password"
        placeholder="密码"
        allowClear
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input-password>
    </a-form-item>
    <!-- 姓名输入框 -->
    <a-form-item label="姓名">
      <a-input
        v-decorator="decorator.name"
        placeholder="姓名"
        allowClear
      />
    </a-form-item>
    <!-- 职称选择框 -->
    <a-form-item label="职称">
      <a-select
        v-decorator="decorator.rank"
        :options="ranks"
        allowClear
        placeholder="职称"
      />
    </a-form-item>
    <!-- 描述输入框 -->
    <a-form-item label="描述">
      <a-textarea
        v-decorator="decorator.description"
        placeholder="描述"
        allowClear
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { pick } from 'lodash-es';
import { ranks } from '@/utils/const';
import EditMixin from './edit-mixin';

export default {
  name: 'EditTeacher',
  mixins: [EditMixin],
  data() {
    return {
      ranks,
      decorator,
    };
  },
  methods: {
    initData() {
      const { data } = this;
      const result = pick(data, ['tid', 'name', 'rank', 'description']);
      this.form.setFieldsValue(result);
    },
  },
};

/**
 * 定义decorator
 */
const decorator = {
  tid: ['tid', {
    rules: [{
      required: true,
      message: '请输入工号！',
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
  rank: ['rank', {
    initialValue: 0, // 初始值为 0
    rules: [{
      required: true,
      message: '请选择职称！',
    }],
  }],
  description: ['description', {
    initialValue: '', // 初始值为空字符串
  }],
};
</script>
