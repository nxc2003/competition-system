import SearchForm from './SearchForm'; // 导入 SearchForm 组件
import AuditForm from './ConfigForm'; // 导入 AuditForm 组件
import { isFunction } from 'lodash-es'; // 导入 lodash-es 库中的 isFunction 方法

// 注册组件的函数
function register(Vue, comp, options) {
  const { matcher, locale } = options; // 从 options 对象中解构出 matcher 和 locale 属性
  if (isFunction(matcher)) { // 如果 matcher 是一个函数
    comp.props.matcher.default = matcher; // 设置组件的 matcher 属性的默认值为传入的 matcher 函数
  }
  if (isFunction(locale)) { // 如果 locale 是一个函数
    comp.props.locale.default = locale; // 设置组件的 locale 属性的默认值为传入的 locale 函数
  }
  Vue.component(comp.name, comp); // 在 Vue 实例上注册该组件
}

// 给 SearchForm 组件添加 install 方法
SearchForm.install = function(Vue, options = {}) {
  register(Vue, SearchForm, options); // 调用 register 函数注册 SearchForm 组件
};

// 给 AuditForm 组件添加 install 方法
AuditForm.install = function(Vue, options = {}) {
  register(Vue, AuditForm, options); // 调用 register 函数注册 AuditForm 组件
};

// 导出 SearchForm 和 AuditForm 组件
export { SearchForm, AuditForm };

// 默认导出一个安装函数
export default function(Vue, options = {}) {
  Vue.use(SearchForm, options); // 使用 Vue.use 方法注册 SearchForm 组件
  Vue.use(AuditForm, options); // 使用 Vue.use 方法注册 AuditForm 组件
};
