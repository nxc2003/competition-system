import Vue from 'vue'; // 导入 Vue 库
import VueMeta from 'vue-meta'; // 导入 vue-meta 库，用于管理页面的 meta 信息
import AntDesign, { Modal } from 'ant-design-vue'; // 导入 Ant Design Vue 组件库及其 Modal 组件
import ConfirmModal from './confirm'; // 导入自定义的确认模态框插件
import Drawer from './drawer'; // 导入自定义的抽屉插件
import AntTable from '@/components/AntTable'; // 导入自定义的 AntTable 组件
import 'ant-design-vue/dist/antd.less'; // 导入 Ant Design Vue 的样式文件
import 'animate.css'; // 导入 animate.css 动画样式文件
import '@/style/reset.styl'; // 导入自定义的重置样式文件
import './form'; // 导入自定义的表单插件

Vue.use(VueMeta); // 使用 VueMeta 插件
Vue.use(AntDesign); // 使用 Ant Design Vue 插件

// 注册自定义的 AntTable 组件
Vue.component(AntTable.name, AntTable);

// 将 Ant Design Vue 的 Modal 组件实例挂载到 Vue 的原型上，以便在组件内通过 this.$modal 访问
Vue.prototype.$modal = Modal;

// 将自定义的 ConfirmModal 插件挂载到 Vue 的原型上，以便在组件内通过 this.$confirm 访问
Vue.prototype.$confirm = ConfirmModal;

// 将自定义的 Drawer 插件挂载到 Vue 的原型上，以便在组件内通过 this.$drawer 访问
Vue.prototype.$drawer = Drawer;
