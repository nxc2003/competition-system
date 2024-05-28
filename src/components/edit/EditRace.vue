<template>
  <!-- 表单组件，使用 Ant Design Vue 的 Form 组件 -->
  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :form="form"
  >
    <!-- 赛事名称输入框 -->
    <a-form-item label="名称">
      <a-input v-decorator="decorator.title" placeholder="赛事名称"/>
    </a-form-item>
    <!-- 主办方输入框 -->
    <a-form-item label="主办方">
      <a-input v-decorator="decorator.sponsor" placeholder="主办方"/>
    </a-form-item>
    <!-- 地点输入框 -->
    <a-form-item label="地点">
      <a-input v-decorator="decorator.location" placeholder="地点"/>
    </a-form-item>
    <!-- 时间选择框 -->
    <a-form-item label="时间">
      <a-date-picker
        v-decorator="decorator.date"
        :disabled-date="disableDate"
        value-format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
        placeholder="选择比赛时间"
      />
    </a-form-item>
    <!-- 类别选择框 -->
    <a-form-item label="类别">
      <a-select
        v-decorator="decorator.type"
        placeholder="请选择赛事类别"
      >
        <!-- 循环渲染选项 -->
        <a-select-option
          v-for="item in ['A', 'B', 'C', 'D', 'E', 'F']"
          :key="item"
          :value="item"
        >
          {{ item }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <!-- 级别选择框 -->
    <a-form-item label="级别">
      <a-select v-decorator="decorator.level" :options="raceLevels"/>
    </a-form-item>
    <!-- 描述输入框 -->
    <a-form-item label="描述">
      <a-textarea v-decorator="decorator.description" placeholder="描述"/>
    </a-form-item>
  </a-form>
</template>

<script>
import dayjs from 'dayjs'; // 导入 dayjs 用于日期处理
import EditMixin from './edit-mixin'; // 导入 EditMixin 混入
import { raceLevels } from '@/utils/const'; // 导入比赛级别常量

export default {
  name: 'EditRace', // 组件名称
  mixins: [EditMixin], // 使用 EditMixin 混入
  data() {
    return {
      raceLevels, // 比赛级别选项
      decorator, // 表单装饰器
    };
  },
  methods: {
    // 禁用日期函数，禁止选择今天之前的日期
    disableDate(cur) {
      const yesterday = dayjs().startOf('day');
      return cur.isSameOrBefore(yesterday);
    },
    // 初始化表单数据
    initData() {
      const { data } = this;
      this.form.setFieldsValue({
        title: data.title,
        sponsor: data.sponsor,
        date: data.date,
        location: data.location,
        level: data.level,
        type: data.type,
        description: data.description,
      });
    },
  },
};

// 定义表单装饰器，用于表单字段的验证和初始化
const decorator = {
  title: ['title', {
    rules: [{
      required: true,
      message: '请输入赛事名称！',
    }],
  }],
  sponsor: ['sponsor', {
    rules: [{
      required: true,
      message: '请输入主办方！',
    }],
  }],
  date: ['date', {
    rules: [{
      required: true,
      message: '选择时间！',
    }],
  }],
  location: ['location', {
    rules: [{
      required: true,
      message: '请填写地点！',
    }],
  }],
  level: ['level', {
    initialValue: 1, // 初始值为 1
  }],
  type: ['type', {
    initialValue: 'A', // 初始值为 'A'
  }],
  description: ['description', {
    initialValue: '', // 初始值为空字符串
  }],
};
</script>
