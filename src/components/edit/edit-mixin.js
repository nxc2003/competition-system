// 从 ant-design-vue 中导入 message 组件，用于显示提示信息
import { message } from 'ant-design-vue';

// 导出一个包含组件选项的对象，用作混入
export default {
  // 接收一个名为 data 的 prop，类型为对象
  props: {
    data: Object,
  },
  // 定义组件的内部状态
  data() {
    return {
      labelCol: { span: 3 },  // 表单标签的布局配置
      wrapperCol: { span: 20 },  // 表单控件的布局配置
      changed: false,  // 标识表单数据是否发生变化
    };
  },
  // 计算属性
  computed: {
    // 判断当前是否为编辑模式
    isEdit() {
      return !!this.data;  // data 属性存在则为 true，否则为 false
    },
  },
  // 组件创建之前的钩子函数
  beforeCreate() {
    // 创建一个表单实例，并在表单值发生变化时设置 changed 为 true
    this.form = this.$form.createForm(this, {
      onValuesChange: _ => { this.changed = true; },
    });
  },
  // 组件挂载后的钩子函数
  mounted() {
    // 如果是编辑模式，则初始化数据
    if (this.isEdit) {
      this.initData();
      this.changed = false; // 初始化数据后将 changed 重置为 false
    }
  },
  // 定义组件的方法
  methods: {
    // 重置表单字段，并设置 changed 为 true
    reset() {
      this.form.resetFields();
      this.changed = true;
    },
    // 验证表单字段
    validate() {
      // 如果是编辑模式且数据没有发生变化，则提示并拒绝验证
      if (this.isEdit && !this.changed) {
        message.info('未检测到数据变动');  // 显示提示信息
        return Promise.reject('未检测到数据变动');  // 返回拒绝的 Promise
      }
      // 否则，验证表单字段并返回 Promise
      return this.form.validateFields();
    },
  },
};
