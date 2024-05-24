<template lang="pug">
.search-form-container
  .form
    ConfigForm(
      ref="form",
      :options="options",
      :matcher="matcher",
      @change="$emit('change', $event)"
    )
  .operate-button-group
    a-button(type="primary", :loading="loading", @click="search") 查询
    a-button(type="link", @click="reset") 重置
</template>

<script>
import ConfigForm from './ConfigForm'; // 导入ConfigForm组件
import { noop } from 'lodash-es'; // 从lodash-es库中导入noop方法

export default {
  name: 'SearchForm', // 组件名称
  components: {
    ConfigForm, // 注册ConfigForm组件
  },
  props: {
    options: {
      type: Array, // options属性类型为数组
      required: true, // options属性为必填项
      default: () => [], // options的默认值为空数组
    },
    loading: {
      type: Boolean, // loading属性类型为布尔值
      default: false, // loading的默认值为false
    },
    immediate: {
      type: Boolean, // immediate属性类型为布尔值
      default: false, // immediate的默认值为false
    },
    matcher: {
      type: Function, // matcher属性类型为函数
      default: noop, // matcher的默认值为noop函数
    },
    locale: {
      type: Function, // locale属性类型为函数
      default: key => key, // locale的默认值为返回键值本身的函数
    },
  },
  computed: {
    result() {
      return this.$refs.form.getResult(); // 计算属性result，获取表单结果
    },
    formData() {
      return this.$refs.form.getFormData(); // 计算属性formData，获取表单数据
    },
  },
  watch: {
    options: {
      deep: true, // 深度监听options属性
      immediate: true, // 立即执行监听器
      handler() {
        if (this.immediate) {
          // 如果immediate为true
          this.$nextTick(this.search); // 在下一次DOM更新后执行search方法
        }
      },
    },
  },
  methods: {
    getResult() {
      return this.result; // 获取表单结果
    },
    getFormData() {
      return this.formData; // 获取表单数据
    },
    setState(...args) {
      this.$refs.form.setState(...args); // 设置表单状态
    },
    search() {
      this.$emit('search', this.getResult(), this.getFormData()); // 触发search事件，传递表单结果和数据
    },
    reset() {
      this.$refs.form.reset(); // 重置表单
      this.$emit('reset', this.getResult(), this.getFormData()); // 触发reset事件，传递重置后的表单结果和数据
    },
    toQuery() {
      return this.$refs.form.toQuery(); // 转换表单数据为查询参数
    },
  },
};
</script>

<style scoped lang="stylus">
.search-form-container
  display flex
  padding 20px
  background-color white

.form
  flex-grow 1
  padding-right 20px

.operate-button-group >>>
  position relative
  display flex
  flex-direction column
  justify-content center
  padding-left 20px
  border-left 1px solid divider-color
  .ant-btn
    min-width 100px
    &:first-child
      border-radius 2px
      margin-bottom 20px
</style>
