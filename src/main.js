// 导入 Vue 框架
import Vue from 'vue';
// 导入根组件 App.vue
import App from './App.vue';
// 导入路由配置
import router from '@/router';
// 导入 Vuex 状态管理配置
import store from '@/store';
// 导入所有 API 接口
import * as API from '@/api';
// 导入 Ant Design Vue 的中文语言包
import zhCn from 'ant-design-vue/lib/locale-provider/zh_CN';
// 导入权限控制配置
import './permission'; // permission control
// 导入插件配置
import '@/plugins';
// 导入工具配置
import '@/tool';

// 阻止 Vue 在启动时生成生产提示
Vue.config.productionTip = false;
// 将 API 挂载到 Vue 原型上，便于在组件中调用
Vue.prototype.$api = API;

// 创建 Vue 实例
const vm = new Vue({
  // 注入路由配置
  router,
  // 注入 Vuex 配置
  store,
  // 渲染根组件并注入 Ant Design Vue 的中文语言包
  render: h => (
    <a-config-provider locale={zhCn}>
      <App/>
    </a-config-provider>
  ),
});

// 挂载 Vue 实例到 id 为 "app" 的 DOM 元素上
vm.$mount('#app');
