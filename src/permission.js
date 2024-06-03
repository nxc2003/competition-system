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
  console.log(`导航到：${to.path}, 来自：${from.path}`);

  // 调试：检查所有 Cookie
  console.log(`所有 Cookie: ${document.cookie}`);

  // 从 Cookie 中获取用户 token
  const token = Cookie.get('uid');
  console.log(`Token: ${token}`);

  /* 未登录 */
  if (!token) {
    console.log(`用户未登录，目标路径：${to.path}`);
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
    NProgress.done();
    return;
  }

  /* 已登录情况下访问登录界面 */
  if (to.path === loginPath) {
    console.log('已登录，重定向到默认路径');
    next({ path: defaultRoutePath });
    NProgress.done();
    return;
  }

  /* 已获取用户信息 */
  if (store.getters.permissions?.length) {
    console.log('已获取用户信息，直接放行');
    next();
    NProgress.done();
    return;
  }

  /* 未获取用户信息 */
  try {
    console.log('尝试初始化用户信息');
    await store.dispatch('initUser');
    console.log('用户信息初始化成功');
  } catch (e) {
    console.log('用户信息初始化失败，登出并重定向到登录页面');
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
    console.log('没有权限访问，重定向到默认路径');
    next({ path: defaultRoutePath, replace: true });
    NProgress.done();
    return;
  }

  const redirect = decodeURIComponent(from.query.redirect || to.path);
  // 如果路径相同，直接替换 history
  if (redirect === to.path) {
    console.log('路径相同，替换 history');
    next({ ...to, replace: true });
  } else {
    console.log(`重定向到：${redirect}`);
    next(redirect);
  }
  NProgress.done();
});

router.afterEach(() => {
  // 完成进度条
  NProgress.done();
  console.log('导航完成');
});

/**
 * 判断当前路由是否可以进入
 * @param {Object} route
 * @returns {boolean}
 */
function checkAccess(route) {
  const set = new Set(store.getters.permissions);
  const { matched } = route;
  // 调试：输出匹配到的路由及其权限信息
  console.log(`检查路由权限: ${JSON.stringify(matched.map(v => v.meta.auth))}`);
  // 检查路由是否包含权限信息
  return matched.some(v => set.has(v.meta.auth));
}
