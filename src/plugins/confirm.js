import Vue from 'vue'; // 引入Vue库

// 定义ConfirmModal组件
const ConfirmModal = {
  name: 'ConfirmModal', // 组件名称
  data() {
    return {
      title: undefined, // 模态框标题
      okText: '确定', // 确认按钮文本
      cancelText: '取消', // 取消按钮文本
      content: undefined, // 模态框内容
      maskClosable: false, // 点击遮罩层是否可以关闭模态框
      visible: false, // 模态框是否可见
      loading: false, // 确认按钮是否显示加载状态
      onOk() {}, // 确认按钮点击时的回调函数
      onCancel() {}, // 取消按钮点击时的回调函数
    };
  },
  methods: {
    // 确认按钮点击事件处理函数
    async ok() {
      try {
        this.loading = true; // 设置loading状态为true
        await this.onOk(); // 执行确认回调函数
        this.visible = false; // 关闭模态框
      } catch (e) {
        console.warn(e.message || '模态框关闭失败'); // 捕获异常并警告
      } finally {
        this.loading = false; // 最后将loading状态设置为false
      }
    },
    // 取消按钮点击事件处理函数
    cancel() {
      this.onCancel(); // 执行取消回调函数
      this.visible = false; // 关闭模态框
    },
    // 移除模态框DOM元素并销毁Vue实例
    remove() {
      this.$el.remove(); // 移除DOM元素
      this.$destroy(); // 销毁Vue实例
    },
  },
  // 渲染函数
  render(h) {
    return (
      <a-modal
        afterClose={this.remove} // 模态框关闭后的回调
        maskClosable={this.maskClosable} // 是否可以通过点击遮罩层关闭模态框
        title={this.title} // 模态框标题
        okText={this.okText} // 确认按钮文本
        cancelText={this.cancelText} // 取消按钮文本
        visible={this.visible} // 模态框是否可见
        onOk={this.ok} // 确认按钮点击事件处理函数
        onCancel={this.cancel} // 取消按钮点击事件处理函数
        confirmLoading={this.loading} // 确认按钮加载状态
      >
        {
          typeof this.content === 'function'
            ? this.content(h) // 如果content是函数，则调用该函数
            : <div>{ this.content }</div> // 否则直接渲染content内容
        }
      </a-modal>
    );
  },
};

/**
 * $confirm的扩展函数
 * @param{modalOptions} data - 模态框配置选项
 */
export default function(data) {
  const instance = new Vue(ConfirmModal); // 创建ConfirmModal组件实例
  Object.assign(instance.$data, data); // 将data中的配置项合并到组件实例的data中
  const { $el } = instance.$mount(); // 挂载实例并获取DOM元素
  document.body.appendChild($el); // 将模态框的DOM元素添加到body中
  instance.visible = true; // 显示模态框
};
