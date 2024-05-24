import { isString } from 'lodash-es'; // 从 lodash-es 库中导入 isString 方法

export default {
  name: 'FormItemLabel', // 定义组件的名称
  props: {
    option: {
      type: [Object, String, Function], // 定义 option 属性的类型可以是对象、字符串或函数
      required: true, // option 属性是必需的
    },
  },
  render(h) { // 定义渲染函数
    const label = this.option; // 获取 option 属性
    const { createComponent, locale } = this.$parent; // 从父组件中解构出 createComponent 和 locale 方法

    if (isString(label)) { // 如果 label 是字符串
      return h('div', locale(label)); // 返回一个包含本地化后的 label 的 div 元素
    }

    return createComponent(label); // 如果 label 不是字符串，则调用 createComponent 方法渲染组件
  },
};
