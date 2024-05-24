// 导入 Vue 框架
import Vue from 'vue';
// 导入 Vue Router 库
import VueRouter from 'vue-router';
// 导入全局布局组件
import GlobalLayout from '@/layouts/GlobalLayout';
// 告诉 Vue 使用 VueRouter 插件
Vue.use(VueRouter);
// 定义一个名为 RouteView 的组件，用于渲染嵌套路由
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view'),
};
// 定义路由配置数组
export const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: '主页' },
    redirect: '/race/list',
    component: GlobalLayout,
    children: [
      {
        path: '/race',
        name: 'Race',
        redirect: '/race/list',
        component: RouteView,
        meta: { title: '赛事管理', icon: 'appstore' },
        children: [
          {
            path: '/race/list',
            name: 'RaceList',
            component: () => import('@/pages/race/Race'),
            meta: { title: '赛事列表', auth: 'race:query' },
          },
          {
            path: '/race/record',
            name: 'Record',
            component: () => import('@/pages/race/Record'),
            meta: { title: '参赛记录', auth: 'record:query' },
          },
        ],
      },
      {
        path: '/user',
        redirect: '/user/student',
        name: 'User',
        component: RouteView,
        meta: { title: '用户管理', icon: 'user', auth: 'user:query' },
        children: [
          {
            path: '/user/student',
            name: 'Student',
            component: () => import('@/pages/user/Student'),
            meta: { title: '学生列表' },
          },
          {
            path: '/user/teacher',
            name: 'Teacher',
            component: () => import('@/pages/user/Teacher'),
            meta: { title: '教师列表' },
          },
        ],
      },
      {
        path: '/role',
        redirect: '/role/list',
        name: 'Role',
        component: RouteView,
        meta: { title: '权限管理', icon: 'key' },
        children: [
          {
            path: '/role/list',
            name: 'RoleList',
            meta: { title: '角色列表', auth: 'role:query' },
            component: () => import('@/pages/role/RoleList'),
          },
          {
            path: '/role/permission',
            name: 'Permission',
            meta: { title: '权限列表', auth: 'permission:query' },
            component: () => import('@/pages/role/PermissionList'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登陆' },
    component: () => import('@/pages/Login'),
  },
  {
    path: '/404',
    component: () => import('@/components/common/404'),
  },
  {
    path: '*',
    redirect: '/404',
  },
];

// 创建 VueRouter 实例，并传入路由配置
const router = new VueRouter({
  mode: 'history', // 使用 HTML5 History 模式
  base: process.env.BASE_URL, // 基础路径
  routes, // 路由配置数组
});

/**
 * 根据权限过滤路由，生成 pro-layout 需要的菜单
 * @param {[]} routes - 路由配置数组
 * @param {[]} permission - 当前用户拥有的权限
 * @returns {[]} 过滤后的路由配置数组
 */
export function filterRoutes(routes, permission) {
  const set = new Set(permission);

  function filter(routes) {
    const arr = [];
    for (const route of routes) {
      const auth = route.meta?.auth;
      if (!auth || set.has(auth)) {
        arr.push(route);
        if (route.children) {
          const children = filter(route.children);
          route.children = children;
          if (!children.length) {
            route.hidden = true; // pro-layout 隐藏菜单
          }
        }
      }
    }
    return arr;
  }

  return filter(routes);
}

// 导出 VueRouter 实例
export default router;
