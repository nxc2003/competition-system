<template>
  <div>
    <!-- Logo 区域，点击时调用 goHome 方法 -->
    <div class="logo" @click="goHome">
      <a-avatar src="/logo.png" :size="40" />
      <span>竞赛管理系统</span>
    </div>
    <!-- 使用 Ant Design Vue 的 Menu 组件创建菜单 -->
    <a-menu
      theme="dark"
      mode="inline"
      class="menu"
      :selected-keys="selectedKeys"
      :open-keys="openKeys"
      @update:openKeys="value => openKeys = value"
      :inline-collapsed="collapsed"
      @click="handleClick"
    >
      <!-- 遍历 config 数组，生成 SubMenu 菜单项 -->
      <a-sub-menu v-for="item in config" :key="item.key">
        <!-- SubMenu 标题 -->
        <template v-slot:title>  <!-- 将 slot="title" 更新为 v-slot:title -->
          <a-icon v-if="item.icon" :type="item.icon" />
          {{ item.title }}
        </template>
        <!-- 遍历 SubMenu 的子菜单项 -->
        <a-menu-item v-for="child in item.children" :key="child.key">
          {{ child.title }}
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
export default {
  name: 'Sidebar', // 组件名称
  props: {
    collapsed: {
      type: Boolean, // 接受的属性类型
      default: false, // 默认值为 false
    },
  },
  data() {
    return {
      selectedKeys: [], // 当前选中的菜单项 key 数组
      openKeys: [], // 当前展开的 SubMenu 菜单项 key 数组
      config: [ // 菜单配置
        {
          title: '赛事管理', // 菜单项标题
          icon: 'appstore', // 菜单项图标
          key: 'race', // 菜单项 key
          children: [ // 子菜单项
            { key: '/race', title: '赛事' },
            { key: '/record', title: '参赛记录' },
          ],
        },
        {
          title: '用户管理', // 菜单项标题
          icon: 'user', // 菜单项图标
          key: 'user', // 菜单项 key
          children: [ // 子菜单项
            { key: '/student', title: '学生列表' },
            { key: '/teacher', title: '教师列表' },
          ],
        },
        {
          title: '权限管理', // 菜单项标题
          icon: 'key', // 菜单项图标
          key: 'permission', // 菜单项 key
          children: [ // 子菜单项
            { key: '/role_list', title: '角色列表' },
            { key: '/permission_list', title: '权限列表' },
          ],
        },
      ],
    };
  },
  computed: {
    user() {
      return this.$store.state.user; // 从 Vuex store 获取用户信息
    },
  },
  watch: {
    $route: {
      immediate: true, // 立即执行
      handler(to) {
        const selectedKey = to.path; // 获取当前路由路径
        this.selectedKeys = [selectedKey]; // 设置选中的菜单项
        for (const parent of this.config) { // 遍历菜单配置
          for (const child of parent.children) { // 遍历子菜单项
            if (child.key === selectedKey) { // 如果当前路由路径匹配子菜单项的 key
              this.openKeys = [parent.key]; // 展开父菜单项
              return;
            }
          }
        }
      },
    },
  },
  methods: {
    handleClick(data) {
      const { key: path } = data; // 获取点击的菜单项的 key
      this.$router.push(path).catch(e => e); // 跳转到对应的路由
    },
    goHome() {
      this.$router.push('/race').catch(e => e); // 跳转到首页
    },
  },
};
</script>

<style scoped lang="stylus">
.menu li:nth-child(1)
  margin-top 0 !important  // 第一个菜单项的上外边距设为 0

.logo
  display flex  // 使用 Flex 布局
  align-items center  // 子元素垂直居中
  width 100%  // 宽度 100%
  height 64px  // 高度 64px
  margin 0 auto  // 上下外边距 0，左右自动
  color white  // 文本颜色白色
  overflow hidden  // 超出部分隐藏
  white-space nowrap  // 文本不换行
  cursor pointer  // 鼠标指针为指针状
  background-color #002140  // 背景颜色
  span
    margin-left 10px  // 左外边距 10px
    font-size 18px  // 字体大小 18px
</style>
