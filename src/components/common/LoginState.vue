<template>
  <!-- 使用 Ant Design Vue 的 Dropdown 组件 -->
  <a-dropdown>
    <!-- 如果用户没有名字，显示加载动画 -->
    <a-spin v-if="!user.name" size="small" />
    <!-- 如果用户有名字，显示用户头像和名字 -->
    <div v-else class="header-avatar">
      <!-- 用户图标 -->
      <a-icon class="avatar" type="user" />
      <!-- 用户名字 -->
      <span class="name">{{ user.name }}</span>
    </div>
    <!-- 下拉菜单 -->
    <a-menu slot="overlay">
      <!-- 显示用户角色，禁用状态 -->
      <a-menu-item disabled>
        <a-icon type="smile" />
        {{ user.role && user.role.label }}
      </a-menu-item>
      <!-- 修改个人信息选项 -->
      <a-menu-item @click="modifySelfInfo">
        <a-icon type="user" />
        <span>个人信息</span>
      </a-menu-item>
      <!-- 修改密码选项 -->
      <a-menu-item @click="modifyPassword">
        <a-icon type="lock" />
        <span>修改密码</span>
      </a-menu-item>
      <!-- 菜单分隔线 -->
      <a-menu-divider />
      <!-- 退出登录选项 -->
      <a-menu-item @click="logout">
        <a-icon type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import UpdatePassword from '@/components/common/UpdatePassword';
import EditStudent from '@/components/edit/EditStudent';
import EditTeacher from '@/components/edit/EditTeacher';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'LoginState',  // 组件名称
  computed: {
    ...mapState(['user']),  // 映射 vuex 的 state 中的 user 状态
  },
  methods: {
    ...mapActions(['initUser']),  // 映射 vuex 的 initUser 动作
    logout() {
      this.$store.commit('logout');  // 退出登录
      this.$router.replace('/login');  // 跳转到登录页面
    },
    modifyPassword() {
      let vnode;  // 定义 vnode 变量
      this.$drawer({
        title: '修改密码',  // 标题
        content: h => (vnode = <UpdatePassword />),  
        onOk: async () => {
          const values = await vnode.componentInstance.validate();  // 验证表单
          return this.$api.updatePassword({  // 调用 API 更新密码
            account: this.user.account,
            identity: this.user.identity,
            oldVal: values.oldVal,
            newVal: values.newVal,
          }).then(() => {
            this.$message.success('修改成功');  // 成功提示
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '修改失败');  // 失败提示
            throw e;
          });
        },
      });
    },
    modifySelfInfo() {
      let vnode;  // 定义 vnode 变量
      this.$drawer({
        title: '修改个人信息',  // 抽屉的标题
        content: h => (vnode = this.user.identity === 'student'
          ? <EditStudent type="update" data={this.user} />
          : <EditTeacher type="update" data={this.user} />),  // 根据身份选择相应的组件
        onOk: async () => {
          const values = await vnode.componentInstance.validate();  // 验证表单
          return this.$api.updateUser(
            this.user.identity,
            values,
          ).then(() => {
            this.$message.success('修改成功');  // 成功提示
            this.$store.dispatch('initUser');  // 重新初始化用户信息
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '修改失败');  // 失败提示
            throw e;
          });
        },
      });
    },
  },
};
</script>


<style scoped lang="stylus">
.header-avatar
  display inline-flex  // 显示为内联弹性盒子
  align-items center  // 垂直居中对齐
  cursor pointer  // 鼠标悬停时显示指针
  padding 0 10px  // 内边距，左右各 10px
  .avatar
    position relative  // 相对定位
    top -1px  // 向上移动 1px
    margin-right 8px  // 右外边距 8px
  .name
    font-weight 500  // 字体粗细 500
</style>
