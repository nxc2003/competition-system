<template>
  <div class="tab-layout">
    <a-tabs
      type="editable-card"
      class="tab-bar"
      :hide-add="true"
      :active-key="activePage"
      @change="changePage"
      @edit="editPage"
      @contextmenu="onContextmenu"
    >
      <!-- 遍历 pageList 数组，生成标签页 -->
      <a-tab-pane v-for="page in pageList" :key="page.fullPath">
        <template #tab>
          <span :data-key="page.fullPath">
            {{ page.meta.title }}
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
    <!-- 页面切换过渡动画 -->
    <PageToggleTransition name="fadeIn">
      <keep-alive :exclude="dustbin">  <!-- 缓存路由视图，排除 dustbin 中的组件 -->
        <router-view />  <!-- 路由视图 -->
      </keep-alive>
    </PageToggleTransition>
    <!-- 右键菜单组件 -->
    <ContextMenu
      :list="menuItems"
      :visible="menuVisible"
      @update:visible="value => menuVisible = value"
      @select="onMenuSelect"
    />
  </div>
</template>

<script>
import { message } from 'ant-design-vue'; // 导入 Ant Design Vue 的消息提示组件
import { last } from 'lodash-es'; // 导入 Lodash 库的 last 函数
import ContextMenu from '../components/common/ContextMenu'; // 导入自定义的 ContextMenu 组件
import PageToggleTransition from '../components/transition/PageToggleTransition'; // 导入自定义的 PageToggleTransition 组件

export default {
  name: 'TabLayout', // 组件名称
  components: { PageToggleTransition, ContextMenu }, // 注册组件
  data() {
    return {
      pageList: [], // 页面列表
      dustbin: [], // 用于缓存控制的 dustbin
      activePage: '', // 当前激活的页面
      menuVisible: false, // 右键菜单可见性
      menuItems: [ // 右键菜单项列表
        { key: '1', icon: 'arrow-left', text: '关闭左侧' },
        { key: '2', icon: 'arrow-right', text: '关闭右侧' },
        { key: '3', icon: 'close', text: '关闭其它' },
      ],
    };
  },
  watch: {
    $route: {
      immediate: true, // 立即执行
      handler(route) {
        this.activePage = route.fullPath; // 设置当前激活的页面
        this.putCache(route); // 将当前路由放入缓存
        const index = this.pageList.findIndex(item => item.fullPath === route.fullPath);
        if (index === -1) {
          this.pageList.push(route); // 如果页面列表中不存在当前路由，则添加到页面列表
        }
      },
    },
  },
  methods: {
    log(data) {
      console.log(data);
    },
    changePage(key) {
      this.activePage = key; // 更新当前激活的页面
      this.$router.push(key); // 跳转到对应的路由
    },
    editPage(key, action) {
      if (action === 'remove') {
        this.remove(key); // 如果操作是删除，则调用 remove 方法
      }
    },
    remove(key) {
      if (this.pageList.length <= 1) {
        return message.info('最后一页了哦~'); // 如果页面列表中只有一个页面，则提示用户
      }
      let curIndex = this.pageList.findIndex(item => item.fullPath === key);
      const { matched } = this.pageList[curIndex];
      const componentName = last(matched).components.default.name;
      this.dustbin.push(componentName); // 将组件名称添加到 dustbin 中
      this.pageList.splice(curIndex, 1); // 从页面列表中删除当前页面
      if (key === this.activePage) {
        curIndex = curIndex >= this.pageList.length ? this.pageList.length - 1 : curIndex;
        const page = this.pageList[curIndex];
        this.$router.push(page.fullPath).finally(() => {
          this.dustbin.splice(0); // 重置 dustbin，否则会影响到某些组件的缓存
        });
      }
    },
    /**
     * 右键菜单
     */
    onContextmenu(e) {
      const key = getTabKey(e.target);
      if (!key) return;

      e.preventDefault();
      this.menuVisible = true; // 显示右键菜单
    },
    onMenuSelect(key, target) {
      const tabKey = getTabKey(target);
      switch (key) {
        case '1': this.closeLeft(tabKey); break;
        case '2': this.closeRight(tabKey); break;
        case '3': this.closeOthers(tabKey); break;
        default: break;
      }
    },
    closeOthers(tabKey) {
      const index = this.pageList.findIndex(item => item.fullPath === tabKey);
      for (const route of this.pageList) {
        if (route.fullPath !== tabKey) {
          this.clearCache(route); // 清除缓存
        }
      }
      const page = this.pageList[index];
      this.pageList = [page]; // 只保留当前页
      this.activePage = page.fullPath;
      this.$router.push(this.activePage).catch(e => e);
    },
    closeLeft(tabKey) {
      const index = this.pageList.findIndex(item => item.fullPath === tabKey);
      this.pageList.forEach((route, i) => {
        if (i < index) {
          this.clearCache(route); // 清除缓存
        }
      });
      const restPages = this.pageList.slice(index);
      this.pageList = restPages;
      const curActivePage = restPages.find(item => item.fullPath === this.activePage);
      if (!curActivePage) {
        this.activePage = restPages[0].fullPath;
        this.$router.push(this.activePage).catch(e => e);
      }
    },
    closeRight(tabKey) {
      const index = this.pageList.findIndex(item => item.fullPath === tabKey);
      this.pageList.forEach((route, i) => {
        if (i > index) {
          this.clearCache(route); // 清除缓存
        }
      });
      const restPages = this.pageList.slice(0, index + 1);
      this.pageList = restPages;
      const curActivePage = restPages.find(item => item.fullPath === this.activePage);
      if (!curActivePage) {
        this.activePage = last(restPages).fullPath;
        this.$router.push(this.activePage).catch(e => e);
      }
    },
    /**
     * 缓存控制
     */
    clearCache(route) {
      const componentName = last(route.matched).components.default.name;
      this.dustbin.push(componentName); // 清除缓存
    },
    putCache(route) {
      const componentName = last(route.matched).components.default.name;
      if (this.dustbin.includes(componentName)) {
        this.dustbin = this.dustbin.filter(item => item !== componentName); // 从 dustbin 中移除
      }
    },
  },
};

/**
 * 获取Tab标签下dom节点中自定义的数据，递归向下查找最多3层（观察Tab组件渲染后的DOM得出）
 * 该方式属于hack手段，不得已为之
 * @param{HTMLElement} target event.target
 * @param depth 深度
 */
function getTabKey(target, depth = 0) {
  if (depth > 2 || !target) {
    return null;
  }
  return target.dataset.key || getTabKey(target.firstElementChild, ++depth); // 递归查找 data-key 属性
}
</script>

<style scoped lang="stylus">
.tab-bar >>> .ant-tabs-bar
  margin-bottom 0  // 设置 Tab Bar 的下外边距为 0

.breadcrumb
  margin-bottom 10px  // 设置面包屑导航的下外边距为 10px
</style>
