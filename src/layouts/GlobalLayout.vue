<template>
  <!-- 使用 ProLayout 组件 -->
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    fixedHeader
    fixSiderbar
  >
    <!-- 菜单头部渲染内容 -->
    <template #menuHeaderRender>
      <a-avatar src="/logo.png" :size="40" />
      <h1>竞赛管理系统</h1>
    </template>
    <!-- 右侧内容渲染 -->
    <template #rightContentRender>
      <div :class="rightContentClass">
        <LoginState />
      </div>
    </template>
    <template #footerRender>
      <div class="footer-container">
        南昌大学 软件学院 竞赛管理系统 ©2021 Created by Qinxuyang
      </div>
    </template>
    <!-- 自定义头部内容渲染 -->
    <template #headerContentRender>
      <a-breadcrumb
        style="height: 64px; line-height: 64px"
        class="breadcrumb"
        :routes="$route.matched"
      >
        <!-- 自定义面包屑每项的渲染 -->
        <template #itemRender="{ route }">
          {{ route.meta.title }}
        </template>
        <!-- 引入 TabLayout 组件 -->
      </a-breadcrumb>
    </template>
    <TabLayout />
  </pro-layout>
</template>

<script>
import { mapGetters } from 'vuex'; // 导入 mapGetters 函数，用于从 Vuex store 中获取状态
import { filterRoutes, routes } from '@/router'; // 导入路由过滤函数和路由配置
import ProLayout from '@ant-design-vue/pro-layout'; // 导入 ProLayout 组件
import TabLayout from '@/layouts/TabLayout'; // 导入 TabLayout 组件
import LoginState from '@/components/common/LoginState.vue'; // 导入 LoginState 组件

export default {
  name: 'GlobalLayout', // 组件名称
  components: {
    ProLayout,
    LoginState,
    TabLayout,
  },
  data() {
    return {
      collapsed: false, // 菜单是否收起
      autoHideHeader: false, // 是否自动隐藏头部
      query: {}, // 媒体查询数据
      layout: 'sidemenu', // 布局类型
      contentWidth: 'Fluid', // 内容宽度类型
      theme: 'dark', // 主题颜色
      isMobile: false, // 是否为移动设备
    };
  },
  computed: {
    ...mapGetters(['permissions']), // 从 Vuex store 中获取 permissions 状态
    menus() {
      const root = routes.find(v => v.path === '/'); // 找到根路径的路由配置
      return filterRoutes(root?.children || [], this.permissions); // 过滤路由配置，生成菜单数据
    },
    rightContentClass() {
      return [
        'ant-pro-global-header-index-right',
        this.layout === 'topmenu' && `ant-pro-global-header-index-${this.theme}`,
      ]; // 动态设置右侧内容的 CSS 类
    },
  },
  methods: {
    handleCollapse(collapsed) {
      this.collapsed = collapsed; // 更新菜单是否收起的状态
    },
    handleMediaQuery(query) {
      this.query = query; // 更新媒体查询数据
      if (this.isMobile && !query['screen-xs']) {
        this.isMobile = false; // 如果当前为移动设备且不再匹配 'screen-xs' 媒体查询，则设置为非移动设备
        return;
      }
      if (!this.isMobile && query['screen-xs']) {
        this.isMobile = true; // 如果当前为非移动设备且匹配 'screen-xs' 媒体查询，则设置为移动设备
        this.collapsed = false; // 展开菜单
      }
    },
  },
};
</script>

<style lang="less">
@import "~ant-design-vue/es/style/themes/default.less";

.footer-container {
  text-align: center;  // 页脚内容居中对齐
}

.ant-layout-footer {
  padding: 16px 24px;  // 设置页脚的内边距
}

.ant-pro-sider-menu-logo {
  background-color: #002140;  // 设置侧边菜单 logo 的背景颜色
}

.ant-pro-basicLayout-content {
  margin: 10px 10px 0 10px;  // 设置内容区域的外边距
  padding: 10px;  // 设置内容区域的内边距
  background-color: white;  // 设置内容区域的背景颜色
}

.ant-pro-global-header-index-right {
  margin-right: 8px;  // 设置右侧内容的右外边距

  &.ant-pro-global-header-index-dark {
    .ant-pro-global-header-index-action {
      color: hsla(0, 0%, 100%, 0.85);  // 设置暗色主题下的文字颜色

      &:hover {
        background: #1890ff;  // 设置悬停状态下的背景颜色
      }
    }
  }

  .ant-pro-account-avatar {
    .antd-pro-global-header-index-avatar {
      margin: ~"calc((@{layout-header-height} - 24px) / 2)" 0;  // 设置头像的垂直居中对齐
      margin-right: 8px;  // 设置头像的右外边距
      color: @primary-color;  // 设置头像的颜色
      vertical-align: top;  // 设置头像的垂直对齐方式
      background: rgba(255, 255, 255, 0.85);  // 设置头像的背景颜色
    }
  }

  .menu {
    .anticon {
      margin-right: 8px;  // 设置图标的右外边距
    }

    .ant-dropdown-menu-item {
      min-width: 100px;  // 设置下拉菜单项的最小宽度
    }
  }
}
</style>
