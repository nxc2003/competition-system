<template>
  <!-- 登录表单容器 -->
  <div class="login-form">
    <!-- 标题区域，包含 logo 和系统名称 -->
    <div class="title">
      <a-avatar src="/logo.png" :size="40" />
      <span>竞赛管理系统</span>
    </div>
    <!-- 使用 Ant Design Vue 的表单模型 -->
    <a-form-model
      layout="vertical"
      ref="form"
      :model="formData"
      :rules="rules"
      @submit="onSubmit"
    >
      <!-- 表单项：账号输入 -->
      <a-form-model-item ref="account" prop="account">
        <a-input v-model="formData.account" placeholder="学号/工号">
          <!-- 输入框前置图标（用户图标） -->
          <template v-slot:prefix>
            <a-icon type="user" style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input>
      </a-form-model-item>
      <!-- 表单项：密码输入 -->
      <a-form-model-item ref="password" prop="password">
        <a-input-password v-model="formData.password" placeholder="密码">
          <!-- 输入框前置图标（锁图标） -->
          <template v-slot:prefix>
            <a-icon type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input-password>
      </a-form-model-item>
      <!-- 表单项：验证码输入 -->
      <a-form-model-item ref="code" prop="code">
        <div class="code-input">
          <a-input v-model="formData.code" placeholder="验证码">
            <!-- 输入框前置图标（邮件图标） -->
            <template v-slot:prefix>
              <a-icon type="mail" style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
          <!-- 验证码图片，点击刷新 -->
          <div class="code" v-html="svg" @click="getCode" />
        </div>
      </a-form-model-item>
      <!-- 表单项：身份选择 -->
      <a-form-model-item prop="identity">
        <a-radio-group v-model="formData.identity" class="identity">
          <a-radio value="student">学生</a-radio>
          <a-radio value="teacher">教师</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <!-- 登录按钮 -->
      <a-button
        type="primary"
        html-type="submit"
        class="login-button"
        :loading="loading"
        block
      >
        登录
      </a-button>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'Login', // 组件名称
  data() {
    return {
      loading: false, // 控制登录按钮的加载状态
      svg: '', // 验证码图片
      formData: {
        account: '', // 用户账号
        password: '', // 用户密码
        code: '', // 验证码
        identity: 'student', // 用户身份，默认值为学生
      },
      rules: {
        account: { required: true, message: '请输入学号/工号！' }, // 账号验证规则
        password: { required: true, message: '请输入密码！' }, // 密码验证规则
        code: { required: true, message: '请输入验证码！' }, // 验证码验证规则
      },
    };
  },
  mounted() {
    this.getCode(); // 组件挂载后获取验证码
  },
  methods: {
    // 获取验证码
    getCode() {
      this.formData.code = '';
      this.$api.getAuthCode().then(data => {
        this.svg = data.data;
      }).catch(e => {
        this.$message.error(e.msg || '验证码获取失败');
      });
    },
    // 提交表单
    async onSubmit(e) {
      e.preventDefault();
      try {
        this.loading = true;
        await this.$refs.form.validate(); // 验证表单
        await this.$api.login(this.formData); // 登录请求
        await this.$router.replace({ path: '/' }).catch(e => e); // 跳转到主页
        this.$message.success(`${timeFix()}，欢迎回来`);
      } catch (e) {
        if (!e) return; // 表单验证失败
        console.error(e);
        this.getCode();
        // 设置表单校验状态
        if (e.code && e.msg) {
          const field = ({ 1: 'account', 2: 'password', 3: 'code' })[e.code];
          Object.assign(this.$refs[field], {
            validateMessage: e.msg,
            validateState: 'error',
          });
        }
      } finally {
        this.loading = false; // 取消按钮加载状态
      }
    },
  },
};

// 根据时间返回问候语
function timeFix() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好';
}
</script>

<style scoped lang="stylus">
.login-form
  width 300px  // 表单宽度
  padding 20px  // 表单内边距
  text-align left  // 文本左对齐
  border-radius 5px  // 圆角边框
  background-color white  // 背景颜色为白色
  box-shadow 0 0 5px lightgrey  // 盒子阴影

.title
  display flex  // 使用弹性布局
  justify-content center  // 水平居中
  align-items center  // 垂直居中
  margin-bottom 24px  // 底部外边距
  font-size 24px  // 字体大小
  *:last-child
    margin-left 10px  // 最后一个子元素的左边距

.identity
  display flex  // 使用弹性布局
  flex-flow row nowrap  // 横向不换行
  justify-content space-between  // 水平间距

.login-form-bottom
  margin-bottom 0  // 底部外边距
  .login-button
    margin-bottom 20px  // 按钮底部外边距

.code-input
  display flex  // 使用弹性布局
  align-items center  // 垂直居中
  height 32px  // 高度
  .code >>>
    cursor pointer  // 鼠标指针样式为指针
    min-width 100px  // 最小宽度
</style>
