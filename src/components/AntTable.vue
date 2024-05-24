<script>
import { merge, isFunction } from 'lodash-es'; // 导入 lodash-es 的 merge 和 isFunction 函数
import ColumnSetting from '@/components/common/ColumnSetting'; // 导入 ColumnSetting 组件

export default {
  name: 'AntTable', // 组件名称
  props: {
    // v-model 绑定已选项
    value: {
      type: Array, // 绑定的数据类型为数组
      default: () => [], // 默认值为空数组
    },
    rowKey: {
      type: [String, Function], // 类型可以是字符串或函数
      default: 'id', // 默认值为 'id'
    },
    columns: {
      type: Array, // 列配置的类型为数组
      default: () => [], // 默认值为空数组
    },
    size: {
      type: String, // 表格大小的类型为字符串
      default: 'middle', // 默认值为 'middle'
    },
    rowSelection: {
      type: Object, // 行选择配置的类型为对象
      default: null, // 默认值为 null
    },
  },
  data() {
    return {
      customSize: this.size, // 自定义表格大小
      customTableColumns: this.columns, // 自定义列配置
    };
  },
  watch: {
    columns(columns) {
      this.customTableColumns = columns; // 当 columns 属性变化时，更新自定义列配置
    },
    size(size) {
      this.customSize = size; // 当 size 属性变化时，更新自定义表格大小
    },
  },
  render() {
    const { input } = this.$listeners; // 获取 input 事件监听器
    const useVModel = isFunction(input) && Array.isArray(this.value); // 判断是否使用 v-model 绑定

    // 合并所有属性
    const allProps = {
      scopedSlots: this.$scopedSlots, // 插槽
      on: this.$listeners, // 事件监听器
      props: merge({
        size: this.customSize, // 表格大小
        rowKey: this.rowKey, // 行键值
        columns: this.customTableColumns, // 列配置
        bordered: true, // 是否显示边框
        scroll: { x: 1000 }, // 滚动配置
        rowSelection: useVModel
          ? { selectedRowKeys: this.value, onChange: input } // 使用 v-model 绑定行选择
          : this.rowSelection, // 否则使用传入的 rowSelection
        pagination: {
          showQuickJumper: true, // 是否显示快速跳转
          showSizeChanger: true, // 是否显示分页大小选择
          showTotal: total => `共 ${total} 条记录`, // 显示总记录数
        },
      }, this.$attrs), // 合并其他属性
    };

    return (
      <div class="table-wrapper">
        <div class="table-header">
          <div class="left">{this.$slots.header}</div> {/* 左侧插槽内容 */}
          <div class="right">
            <ColumnSetting
              columns={this.columns}
              onChange={e => { this.customTableColumns = e; }} // 当列配置改变时，更新自定义列配置
            />
          </div>
        </div>
        <a-divider style="margin: 10px 0" /> {/* 分割线 */}
        <a-table {...allProps}>
          {/* 原样传递插槽 */}
          {Object.keys(this.$slots).map(name => (
            <template slot={name}>{this.$slots[name]}</template>
          ))}
        </a-table>
      </div>
    );
  },
};
</script>


<style lang="stylus" scoped>
.table-header
  display flex // 使用flex布局
  align-items center // 垂直居中
  margin-bottom 10px // 下边距为10px
  .left, .right
    display flex // 使用flex布局
    align-items center // 垂直居中
  .left
    flex-grow 1 // 占据剩余空间
  .right > *:not(:last-child)
    margin-right 10px // 右边距为10px（除了最后一个子元素）
</style>
