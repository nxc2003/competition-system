import Vue from 'vue'; // 导入 Vue 库
import Cookie from 'js-cookie'; // 导入 js-cookie 库，用于操作 cookie
import Vuex, { createLogger } from 'vuex'; // 导入 Vuex 库及其 createLogger 函数，用于状态管理
import { getUserData } from '@/api'; // 导入 getUserData 函数，用于获取用户数据

Vue.use(Vuex); // 使用 Vuex 插件

const debug = process.env.NODE_ENV !== 'production'; // 根据当前环境判断是否为开发模式

// 创建 Vuex 仓库实例
const store = new Vuex.Store({
  strict: debug, // 开发模式下启用严格模式
  plugins: debug ? [createLogger()] : [], // 开发模式下启用日志插件
  state: {
    user: {}, // 用户数据
  },
  getters: {
    permissions(state) {
      return state.user.permissions || []; // 获取用户的权限列表
    },
  },
  actions: {
    // 初始化用户数据的异步操作
    initUser({ commit }) {
      return getUserData().then(data => {
        commit('setUserData', data.data); // 提交 mutation 更新用户数据
        return data.data; // 返回用户数据
      });
    },
  },
  mutations: {
    // 注销操作，移除 cookie 中的 uid
    logout() {
      Cookie.remove('uid');
    },
    // 更新用户数据
    setUserData(state, user) {
      state.user = user;
    },
  },
});

export default store; // 导出 Vuex 仓库实例

/**
 * 判断当前用户是否具有对应的权限
 * @param {string} permission 类似于 user:query 这样的字符串
 * @returns {boolean}
 */
Vue.prototype.$has = function(permission) {
  return store.getters.permissions.some(v => v === permission); // 检查权限列表中是否包含指定权限
};
