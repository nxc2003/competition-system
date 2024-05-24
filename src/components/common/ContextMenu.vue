<template>
  <a-menu
    v-show="visible"
    class="contextmenu"
    :style="style"
    :selectedKeys="selectedKeys"
    @click="handleClick"
  >
    <a-menu-item v-for="item in list" :key="item.key">
      <a-icon v-if="item.icon" :type="item.icon"/>
      <span>{{ item.text }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    // visible 属性，控制菜单是否可见
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    // list 属性，菜单项列表
    list: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      left: 0,  // 菜单的水平位置
      top: 0,  // 菜单的垂直位置
      target: null,  // 触发菜单的目标元素
      selectedKeys: [],  // 已选中的菜单项的 key 列表
    };
  },
  computed: {
    // 计算属性，用于动态绑定菜单的样式
    style() {
      return {
        left: this.left + 'px',
        top: this.top + 'px',
      };
    },
  },
  created() {
    // 点击事件处理函数，关闭菜单
    const clickHandler = () => this.closeMenu();
    // 右键菜单事件处理函数，设置菜单位置
    const contextMenuHandler = e => this.setPosition(e);
    // 绑定全局点击事件监听器
    window.addEventListener('click', clickHandler);
    // 绑定全局右键菜单事件监听器
    window.addEventListener('contextmenu', contextMenuHandler);
    // 在组件销毁前移除事件监听器
    this.$emit('hook:beforeDestroy', () => {
      window.removeEventListener('click', clickHandler);
      window.removeEventListener('contextmenu', contextMenuHandler);
    });
  },
  methods: {
    // 关闭菜单
    closeMenu() {
      this.$emit('update:visible', false);
    },
    // 设置菜单位置
    setPosition(e) {
      this.left = e.clientX;
      this.top = e.clientY;
      this.target = e.target;
    },
    // 处理菜单项点击事件
    handleClick({ key }) {
      this.$emit('select', key, this.target);
      this.closeMenu();
    },
  },
};
</script>


<style lang="stylus" scoped>
  .contextmenu
    position fixed
    z-index 1000
    border-radius 4px
    border 1px lightgrey solid
    box-shadow 4px 4px 10px lightgrey !important
  .ant-menu-item
    margin 0 !important
</style>
