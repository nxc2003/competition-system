<template>
  <!-- 使用 a-form-model 组件来创建表单 -->
  <a-form-model
    ref="form" 
    :label-col="{ span: 4 }"  
    :wrapper-col="{ span: 20 }"  
    :model="formData"  
    :rules="rules"
  >
    <!-- 表单项，标签为 "原密码"，属性为 "password" -->
    <a-form-model-item label="原密码" prop="password">
      <!-- 密码输入框，绑定 formData.password -->
      <a-input-password v-model="formData.password" placeholder="原密码">
        <!-- 在输入框前显示锁图标 -->
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input-password>
    </a-form-model-item>
    <!-- 表单项，标签为 "新密码"，属性为 "newPass" -->
    <a-form-model-item label="新密码" prop="newPass">
      <!-- 密码输入框，绑定 formData.newPass -->
      <a-input-password v-model="formData.newPass" placeholder="新密码">
        <!-- 在输入框前显示锁图标 -->
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input-password>
    </a-form-model-item>
    <!-- 表单项，标签为 "再次输入"，属性为 "reNewPass" -->
    <a-form-model-item label="再次输入" prop="reNewPass">
      <!-- 密码输入框，绑定 formData.reNewPass -->
      <a-input-password v-model="formData.reNewPass" placeholder="再次输入">
        <!-- 在输入框前显示锁图标 -->
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input-password>
    </a-form-model-item>
  </a-form-model>
</template>


<script>
export default {
  name: 'UpdatePassword',  // 组件名称--更新密码
  data() {
    return {
      rules: getRules.call(this),  // 表单验证规则
      formData: {  // 表单数据模型
        password: '',  // 原密码
        newPass: '',  // 新密码
        reNewPass: '',  // 再次输入的新密码
      },
    };
  },
  methods: {
    validate() {
      // 依次校验表单字段，遇到失败项就停止
      const promise = Object.keys(this.rules).reduce((promise, key) => {
        return promise.then(() => new Promise((resolve, reject) => {
          this.$refs.form.validateField(key, msg => {
            if (msg) reject(new Error(msg));  // 如果有错误信息，则拒绝 Promise
            else resolve();  // 否则，解析 Promise
          });
        }));
      }, Promise.resolve());
      return promise.then(() => ({
        oldVal: this.formData.password,  // 返回原密码
        newVal: this.formData.newPass,  // 返回新密码
      }));
    },
  },
};

function getRules() {
  return {
    password: {
      required: true,  // 必填项
      message: '请输入密码！',  // 验证失败时的提示信息
    },
    newPass: {
      required: true,  // 必填项
      validator: (rule, value, callback) => {
        const oldPass = this.formData.password;
        if (!value) {
          callback(new Error('请输入新密码！'));  // 新密码为空时的提示信息
        } else if (value === oldPass) {
          callback(new Error('新密码不能与原密码相同！'));  // 新密码与原密码相同时的提示信息
        } else {
          callback();  // 验证通过
        }
      },
    },
    reNewPass: {
      required: true,  // 必填项
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请确认新密码！'));  // 确认新密码为空时的提示信息
        } else if (value !== this.formData.newPass) {
          callback(new Error('两次密码不一致'));  // 确认新密码与新密码不一致时的提示信息
        } else {
          callback();  // 验证通过
        }
      },
    },
  };
}
</script>
