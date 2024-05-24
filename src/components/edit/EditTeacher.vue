<template>
   <!-- 使用 Ant Design Vue 的 Form 组件创建表单 -->
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
        placeholder="职工号"
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
      <a-input
        ref="password"
        v-decorator="decorator.password"
        placeholder="密码"
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input>
    </a-form-item>
    <!-- 姓名输入框 -->
    <a-form-item label="姓名">
      <a-input
        v-decorator="decorator.name"
        placeholder="姓名"
      />
    </a-form-item>
    <!-- 职称选择框 -->
    <a-form-item label="职称">
      <a-select
        v-decorator="decorator.rank"
        placeholder="请选择职称"
        :options="ranks"
      />
    </a-form-item>
    <!-- 描述输入框 -->
    <a-form-item label="描述">
      <a-textarea
        v-decorator="decorator.description"
        placeholder="描述"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { pick } from 'lodash-es';  // 从 lodash-es 导入 pick 函数，用于选择对象属性
import { ranks } from '@/utils/const';  // 从 utils/const 导入职称选项数据
import EditMixin from './edit-mixin';  // 导入 EditMixin 混入，用于共享表单编辑逻辑

export default {
  name: 'EditTeacher',  // 组件名称
  mixins: [EditMixin],  // 使用 EditMixin 混入
  data() {
    return {
      ranks,  // 职称选项数据
      decorator,  // 表单装饰器
    };
  },
  methods: {
    // 初始化表单数据
    initData() {
      const { data } = this;
      this.form.setFieldsValue(
        pick(data, ['tid', 'name', 'rank', 'description']),  // 选择需要的表单字段
      );
    },
  },
};

/**
 * 定义表单装饰器
 */
const decorator = {
  tid: ['tid', {
    rules: [{
      required: true,
      message: '请输入职工号！',
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
    initialValue: 0,  // 初始值为 0
  }],
  description: ['description', {
    initialValue: '',  // 初始值为空字符串
  }],
};
</script>
