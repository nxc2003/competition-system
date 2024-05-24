// 导入 Cookie 操作库
import Cookie from 'js-cookie';
// 导入 Vuex 状态管理
import store from '@/store';
// 导入路由配置
import router from '@/router';
// 导入通知组件
import { notification } from 'ant-design-vue';
// 导入进度条库
import NProgress from 'nprogress'; // progress bar
// 导入进度条样式
import 'nprogress/nprogress.css';
// 配置 NProgress，不显示加载小圆圈
NProgress.configure({ showSpinner: false });
// 定义登录路径
const loginPath = '/login';
// 定义默认路由路径
const defaultRoutePath = '/race/list';
// 定义路由白名单，未登录情况下可以访问的页面
const whiteList = ['Login'];
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start();
  // 从 Cookie 中获取用户 token
  const token = Cookie.get('uid');
  /* 未登录 */
  if (!token) {
    // 如果在白名单内，允许访问
    if (whiteList.includes(to.name)) {
      next();
    } else {
      // 否则重定向到登录页面，并传递当前路径作为重定向目标
      next({
        path: loginPath,
        query: {
          redirect: to.fullPath,
        },
      });
    }
    return;
  }
  /* 已登录情况下访问登录界面 */
  if (to.path === loginPath) {
    // 如果已登录，访问登录页面时，重定向到默认路径
    next(defaultRoutePath);
    return;
  }
  /* 已获取用户信息 */
  if (store.getters.permissions?.length) {
    // 如果已获取用户信息，直接放行
    next();
    NProgress.done();
    return;
  }
  /* 未获取用户信息 */
  try {
    // 尝试初始化用户信息
    await store.dispatch('initUser');
  } catch (e) {
    // 获取用户信息失败，登出并重定向到登录页面
    store.commit('logout');
    next({ path: loginPath, query: { redirect: to.fullPath } });
    notification.error({
      message: '错误',
      description: '请求用户信息失败，请重试',
    });
    NProgress.done();
    return;
  }
  /* 成功获取用户信息 */
  // 检查路由权限
  if (!checkAccess(to)) {
    // 没有权限访问，重定向到默认路径
    next({ path: defaultRoutePath, replace: true });
    NProgress.done();
    return;
  }
  const redirect = decodeURIComponent(from.query.redirect || to.path);
  // 如果路径相同，直接替换 history
  if (redirect === to.path) {
    next({ ...to, replace: true });
  } else {
    next(redirect);
  }
  NProgress.done();
});

router.afterEach(() => {
  // 完成进度条
  NProgress.done();
});

/**
 * 判断当前路由是否可以进入
 * @param {Object} route
 * @returns {boolean}
 */
function checkAccess(route) {
  const set = new Set(store.getters.permissions);
  const { matched } = route;
  // 检查路由是否包含权限信息
  return matched.some(v => set.has(v.meta.auth));
}
