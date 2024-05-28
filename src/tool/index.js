import Vue from 'vue'; // 导入 Vue 库
import DelPopConfirm from '@/tool/DelPopConfirm'; // 导入 DelPopConfirm 组件

// 使用 Vue.component 方法将 DelPopConfirm 注册为全局组件，
// 使用组件的 name 属性（即 'DelPopConfirm'）作为组件名称
Vue.component(DelPopConfirm.name, DelPopConfirm);
