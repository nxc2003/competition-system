<script>
export default {
  name: 'Drawer', // 组件名称
  data() {
    return {
      getContainer: 'body', // 抽屉的容器，默认为 body
      title: undefined, // 抽屉的标题
      okText: '确定', // 确定按钮的文本
      cancelText: '取消', // 取消按钮的文本
      content: undefined, // 抽屉的内容
      maskClosable: false, // 点击蒙层是否允许关闭抽屉
      width: 500, // 抽屉的宽度
      height: 500, // 抽屉的高度
      placement: 'right', // 抽屉的展开位置，默认为右侧
      visible: false, // 抽屉是否可见
      loading: false, // 按钮是否处于加载状态
      onOk() {}, // 确定按钮的回调函数
      onCancel() {}, // 取消按钮的回调函数
    };
  },
  methods: {
    async ok() {
      try {
        this.loading = true; // 设置按钮为加载状态
        await this.onOk(); // 执行确定回调函数
        this.visible = false; // 隐藏抽屉
      } catch (e) {
        console.warn(e.message || '抽屉关闭失败'); // 报告错误
      } finally {
        this.loading = false; // 重置加载状态
      }
    },
    cancel() {
      this.onCancel(); // 执行取消回调函数
      this.visible = false; // 隐藏抽屉
    },
    visibleChange(visible) {
      if (!visible) {
        this.$el.remove(); // 从 DOM 中移除元素
        this.$destroy(); // 销毁 Vue 实例
      }
    },
  },
  mounted() {
    // hack: 将 footer 向上移动一个层级便于布局
    const move = () => {
      const footer = this.$refs.footer; // 获取 footer 元素
      if (footer) {
        const container = footer.parentElement.parentElement; // 获取父容器
        container.appendChild(footer); // 将 footer 移动到父容器中
      } else {
        setTimeout(move); // 如果没有找到 footer，延迟执行 move 函数
      }
    };
    move(); // 执行 move 函数
  },
  render(h) {
    return (
      <a-drawer
        class="custom-drawer"
        getContainer={this.getContainer}
        afterVisibleChange={this.visibleChange}
        maskClosable={this.maskClosable}
        title={this.title}
        visible={this.visible}
        width={this.width}
        height={this.height}
        placement={this.placement}
        onClose={this.cancel}
      >
        {
          typeof this.content === 'function'
            ? this.content(h) // 如果 content 是函数，则执行该函数
            : <div>{ this.content }</div> // 否则，直接展示 content
        }
        <div id="drawer-footer" ref="footer">
          <a-button onClick={this.cancel}>{this.cancelText}</a-button>
          <a-button
            type="primary"
            loading={this.loading}
            onClick={this.ok}
          >
            {this.okText}
          </a-button>
        </div>
      </a-drawer>
    );
  },
};
</script>


<style scoped lang="stylus">
.custom-drawer >>>
  .ant-drawer-wrapper-body
    display flex // 使用 flex 布局
    flex-direction column // 垂直排列子元素
  .ant-drawer-body
    flex-grow 1 // 允许抽屉内容区域在容器中扩展
    overflow auto // 内容溢出时自动滚动
    padding 16px 24px // 设置内边距
#drawer-footer
  padding 16px 24px // 设置内边距
  text-align right // 文本右对齐
  border-top 1px solid #e8e8e8 // 顶部边框样式
  button:first-child
    margin-right 10px // 第一个按钮的右外边距
</style>
