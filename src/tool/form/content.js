export default {
  name: 'FormItemContent', // 定义组件名称为 'FormItemContent'
  props: {
    option: {
      type: Object, // 指定 'option' prop 的类型为对象
      required: true, // 表示 'option' prop 是必需的
    },
  },
  render(h) {
    // 使用渲染函数创建组件内容
    return this.$parent.createComponent(this.option);
    // 调用父组件的 createComponent 方法，并传入 'option' prop
  },
};
