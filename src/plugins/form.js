import Vue from 'vue';  // 导入 Vue 库
import Form from '@/tool/form';  // 导入自定义的 Form 组件
import { isFunction, isString } from 'lodash-es';  // 从 lodash-es 库中导入 isFunction 和 isString 函数

// 定义一个函数，用于生成输入框的占位符文本
const getPlaceholder = (prefix, label) => `${prefix}${label}`;

Vue.use(Form, { matcher });  // 使用 Vue 的插件机制注册 Form 组件，并传入一个 matcher 函数

// 定义 matcher 函数，用于匹配不同类型的表单组件并返回相应的渲染函数
function matcher(name) {
  return ({
    'a-input': {
      functional: true,  // 定义一个函数式组件
      render(h, ctx) {  // 定义渲染函数
        const { formOption, attrs, on } = ctx.data;  // 获取组件的数据
        const label = formOption?.label;  // 获取表单选项的标签
        ctx.data.attrs = Object.assign({
          allowClear: true,  // 允许清除输入
          placeholder: isString(label) ? getPlaceholder('请输入', label) : '',  // 设置占位符
        }, attrs);

        const { pressEnter, input } = on;  // 获取事件处理器
        on.pressEnter = e => {
          isFunction(pressEnter) && pressEnter(e);  // 调用 pressEnter 事件处理器
          const vm = ctx.parent.$parent;  // 获取父组件
          // 当父组件是 SearchForm 时，调用其 search 方法触发搜索
          if (vm && vm.$vnode.componentOptions.tag === 'SearchForm') {
            if (!vm.loading) {
              vm.search();
            }
          }
        };

        on.input = e => {
          isFunction(input) && input(e.target.value.trim());  // 调用 input 事件处理器，并去除输入的前后空格
        };

        return h('a-input', ctx.data);  // 渲染 a-input 组件
      },
    },
    'a-select': {
      functional: true,  // 定义一个函数式组件
      render(h, ctx) {  // 定义渲染函数
        const { formOption, attrs, on } = ctx.data;  // 获取组件的数据
        const label = formOption?.label;  // 获取表单选项的标签
        ctx.data.attrs = Object.assign({
          allowClear: true,  // 允许清除输入
          placeholder: isString(label) ? getPlaceholder('请选择', label) : '',  // 设置占位符
        }, attrs);
        const { change, input } = on;  // 获取事件处理器
        on.change = value => {
          input(value);  // 调用 input 事件处理器
          isFunction(change) && change(value);  // 调用 change 事件处理器
        };
        return h('a-select', ctx.data);  // 渲染 a-select 组件
      },
    },
    'a-range-picker': {
      functional: true,  // 定义一个函数式组件
      render(h, ctx) {  // 定义渲染函数
        const { on, attrs } = ctx.data;  // 获取组件的数据
        attrs.valueFormat = 'YYYY-MM-DD';  // 设置日期格式

        const { change, input } = on;  // 获取事件处理器
        on.change = value => {
          input(value);  // 调用 input 事件处理器
          isFunction(change) && change(value);  // 调用 change 事件处理器
        };
        return h('a-range-picker', ctx.data);  // 渲染 a-range-picker 组件
      },
    },
  })[name?.startsWith('a-') ? name : `a-${name}`];  // 根据组件名称匹配相应的渲染函数
}
