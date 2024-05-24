<template>
  <!-- 定义一个 Dropdown 组件，绑定 v-model="show" 以控制显示状态，点击触发 -->
  <a-dropdown v-model="show" :trigger="['click']">
    <!-- 设置图标，点击时展示下拉菜单 -->
    <a-icon type="setting" style="cursor: pointer; font-size: 16px" />
    <!-- 定义下拉菜单内容 -->
    <div slot="overlay" class="ant-dropdown-menu setting ant-dropdown-content">
      <!-- 菜单头部，包含“列展示”全选复选框和重置按钮 -->
      <div class="setting-header setting-item">
        <!-- 复选框，绑定 indeterminate 和 checked 属性，触发 onCheckAllChange 方法 -->
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
        >
          列展示
        </a-checkbox>
        <!-- 重置按钮，点击时调用 init 方法 -->
        <a @click="init">重置</a>
      </div>
      <!-- 分隔线 -->
      <a-divider />
      <!-- 复选框组，使用 draggable 组件实现可拖动排序 -->
      <div class="ant-checkbox-group">
        <draggable v-model="columnSetting" animation="300">
          <!-- 遍历 columnSetting 数组，生成可拖动的复选框项 -->
          <div
            class="setting-item"
            v-for="item in columnSetting"
            :key="item.dataIndex"
          >
            <!-- 拖动手柄 -->
            <div class="setting-handle">
              <a-icon type="more" />
              <a-icon type="more" />
            </div>
            <!-- 复选框，绑定 v-model="item.checked"，显示列标题 -->
            <a-checkbox v-model="item.checked">
              {{ item.title }}
            </a-checkbox>
          </div>
        </draggable>
      </div>
    </div>
  </a-dropdown>
</template>


<script>
// 导入 vuedraggable 组件
import draggable from 'vuedraggable';
export default {
  name: 'ColumnSetting',
  // 注册 draggable 组件
  components: {
    draggable,
  },
  // 接收 columns 作为 props，类型为数组，默认值为空数组
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      show: false, // 控制下拉菜单显示状态
      columnSetting: [], // 存储列设置
    };
  },
  computed: {
    // 返回已勾选的列
    checkedList() {
      return this.columnSetting.filter(v => v.checked);
    },
    // 计算 indeterminate 状态，当部分复选框勾选时返回 true
    indeterminate() {
      return this.checkedList.length > 0 && this.checkedList.length < this.columnSetting.length;
    },
    // 计算全选状态，当所有复选框都勾选时返回 true
    checkAll() {
      return this.checkedList.length === this.columnSetting.length;
    },
  },
  watch: {
    // 监听 checkedList 变化，触发 change 事件并传递已勾选的列
    checkedList(value) {
      this.$emit('change', value);
    },
  },
  mounted() {
    // 组件挂载时初始化列设置
    this.init();
  },
  methods: {
    // 初始化列设置，将 columns 数组中的每一项都设为勾选状态
    init() {
      this.columnSetting = this.columns.map(value => ({ ...value, checked: true }));
    },
    // 全选复选框状态改变时调用，根据全选状态更新所有列的勾选状态
    onCheckAllChange(e) {
      const checked = e.target.checked;
      this.columnSetting = this.columns.map(value => ({ ...value, checked }));
    },
  },
};
</script>

<style lang="less" scoped>
.setting-item {
  display: flex;  /* 使用 flex 布局 */
  align-items: center;  /* 垂直居中对齐 */
  padding: 4px 16px 4px 4px;  /* 设置内边距，上下各 4px，右 16px，左 4px */
  .ant-checkbox-wrapper {
    flex-grow: 1;  /* 复选框占据剩余空间 */
  }
  .setting-handle {
    opacity: 0.8;  /* 设置透明度为 0.8 */
    cursor: move;  /* 鼠标悬停时显示移动光标 */
    .anticon-more {
      font-size: 12px;  /* 图标字体大小 12px */
      margin-top: 2px;  /* 上边距 2px */
      & + .anticon-more {
        margin: 2px 4px 0 -8px;  /* 当相邻的 .anticon-more 元素存在时，设置额外的边距 */
      }
    }
  }
}

.setting-header {
  padding: 5px 16px 10px 24px;  /* 设置内边距，上 5px，右 16px，下 10px，左 24px */
  min-width: 180px;  /* 最小宽度 180px */
}

.setting {
  .ant-divider {
    margin: 0;  /* 去除分隔线的默认外边距 */
  }
  .ant-checkbox-group {
    padding: 4px 0;  /* 设置内边距，上下各 4px */
    display: block;  /* 将复选框组设置为块级元素 */
  }
}
</style>
