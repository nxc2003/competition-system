<template>
  <div class="container">
    <SearchForm
      ref="searchForm"
      :loading="loading"
      :options="searchOptions"
      @search="search"
      @reset="search"
    />

    <!--信息列表-->
    <AntTable
      v-model="selectedKeys"
      row-key="sid"
      :loading="loading"
      :data-source="users"
      :pagination="pagination"
      :columns="tableColumns"
      @change="changePage"
    >
      <template #header>
        <a-button-group>
          <a-button v-if="$has('user:add')" type="primary" @click="addUser">
            添加学生
          </a-button>
          <a-button
            v-if="$has('user:delete')"
            :disabled="!selectedKeys.length"
            @click="batchDelete"
          >
            批量删除 ({{ selectedKeys.length }})
          </a-button>
          <a-button v-if="$has('user:import')" @click="$refs.import.show()">
            Excel导入
          </a-button>
          <a-button
            v-if="$has('user:export')"
            :loading="exporting"
            @click="exportAll"
          >
            全量导出
          </a-button>
        </a-button-group>
      </template>
      <template #action="record">
        <a-space>
          <template v-if="$has('user:update')">
            <!--编辑-->
            <a v-if="$has('user:update')" @click="editUser(record)">
              <a-icon type="edit" />
            </a>

            <!--重置密码-->
            <a-popconfirm
              title="确认重置密码？"
              ok-text="确认"
              cancel-text="取消"
              placement="left"
              @confirm="resetPassword(record)"
            >
              <template #icon>
                <a-icon type="question-circle-o" style="color: orange" />
              </template>
              <a-tooltip placement="top">
                <template #title>
                  <span>重置密码</span>
                </template>
                <a><a-icon type="rollback" /></a>
              </a-tooltip>
            </a-popconfirm>

            <!--授权-->
            <a @click="grantRole(record)">
              <a-icon type="key" />
            </a>
          </template>

          <!--删除-->
          <a-popconfirm
            v-if="$has('user:delete')"
            title="确认删除？"
            ok-text="确认"
            cancel-text="取消"
            placement="left"
            @confirm="deleteUser(record)"
          >
            <template #icon>
              <a-icon type="question-circle-o" style="color: orange" />
            </template>
            <a><a-icon type="delete" /></a>
          </a-popconfirm>
        </a-space>
      </template>
    </AntTable>

    <UserImport type="student" ref="import" @refresh="search" />
  </div>
</template>

<script>
import { grades, gradeMap, sexes, sexMap } from '@/utils/const'; // 引入常量
import { exportData } from '@/utils/excel'; // 引入导出数据的方法
import createColumns from '@/helpers/importuser-columns'; // 引入创建列的方法
import EditStudent from '@/components/edit/EditStudent'; // 引入编辑学生组件
import UserImport from '@/components/common/UserImport'; // 引入用户导入组件
import GrantRole from '@/components/common/GrantRole'; // 引入授权角色组件

// 定义学生表格的列配置
const STUDENT_COLUMNS = [
  { title: '学号', dataIndex: 'sid' },
  { title: '姓名', dataIndex: 'name' },
  { title: '性别', customRender: ({ sex }) => sexMap[sex] }, // 使用性别映射
  { title: '年级', customRender: ({ grade }) => gradeMap[grade] }, // 使用年级映射
  { title: '班级', dataIndex: 'class' },
  { title: '创建时间', dataIndex: 'create_time' },
  { title: '修改时间', dataIndex: 'update_time' },
  {
    title: '操作',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'action' }, // 操作列
  },
];

// 定义导出Excel的方法
function exportExcel(data) {
  const header = STUDENT_COLUMNS.map(v => v.title);
  header.pop(); // 去掉最后一栏操作栏
  return exportData({
    name: '学生信息',
    data,
    header,
    keyMap: {
      sid: '学号',
      name: '姓名',
      sex: ['性别', sex => sexMap[sex]], // 使用性别映射
      grade: ['年级', grade => gradeMap[grade]], // 使用年级映射
      class: '班级',
      create_time: '创建时间',
      update_time: '修改时间',
    },
  });
}

export default {
  name: 'Student',
  metaInfo: {
    title: '学生管理', // 页面标题
  },
  components: {
    UserImport,
  },
  data() {
    return {
      loading: false, // 是否在加载
      exporting: false, // 是否在导出
      query: {}, // 查询参数
      selectedKeys: [], // 选中的键
      users: [], // 学生数据
      current: 1, // 当前页码
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      tableColumns: STUDENT_COLUMNS, // 表格列配置
    };
  },
  computed: {
    searchOptions() {
      return createSearchOptions.call(this); // 创建搜索选项
    },
    curColumns() {
      return createColumns(this.importUserType); // 获取当前列配置
    },
    user() {
      return this.$store.state.user; // 获取当前用户
    },
    pagination() {
      return {
        current: this.current,
        pageSize: this.pageSize,
        total: this.total,
      };
    },
  },
  mounted() {
    // 监听分页变化，立即获取数据
    this.$watch(() => [this.pageSize, this.current], this.getData, { immediate: true });
  },
  methods: {
    search() {
      // 执行搜索
      this.current = 1;
      this.getData();
    },
    changePage({ pageSize, current }) {
      // 更改页码或每页条数
      Object.assign(this, { pageSize, current });
    },
    getData() {
      // 获取数据
      this.loading = true;
      this.query = this.$refs.searchForm.getResult();
      this.$api.getUserList({
        ...this.query,
        type: 'student',
        offset: this.current,
        limit: this.pageSize,
      }).then(data => {
        this.users = data.data;
        this.total = data.count;
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '获取数据失败');
      }).finally(() => {
        this.loading = false;
      });
    },
    resetPassword(row) {
      // 重置密码
      const key = Date.now();
      this.$message.loading({
        key,
        content: '请稍后',
        duration: 0,
      });
      this.$api.resetPassword({
        type: 'student',
        account: row.sid,
      }).then(() => {
        this.$message.success({ content: '已重置', key });
      }).catch(() => {
        this.$message.error({ content: '重置失败', key });
      });
    },
    addUser() {
      // 添加用户
      let vnode;

      this.$confirm({
        title: '添加学生',
        content: h => (vnode = h(EditStudent)),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.addUser('student', values).then(() => {
            this.$message.success('添加成功');
            this.getData();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '添加失败');
            throw e;
          });
        },
      });
    },
    editUser(row) {
      // 编辑用户
      let vnode;
      this.$confirm({
        title: '修改信息',
        content: h => (vnode = <EditStudent type="update" data={row} />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.updateUser(
            'student',
            values,
          ).then(() => {
            this.$message.success('修改成功');
            this.getData();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '修改失败');
            throw e;
          });
        },
      });
    },
    deleteUser(row) {
      // 删除用户
      const key = Math.random();
      this.$message.loading({ content: '正在删除', duration: 0, key });
      this.$api.deleteUser('student', {
        ids: [row.sid],
      }).then(() => {
        this.$message.success({ content: '删除成功!', key });
        this.getData();
      }).catch(e => {
        this.$message.error({ content: e.msg || '删除失败!', key });
      });
    },
    batchDelete() {
      // 批量删除用户
      this.$modal.confirm({
        title: `确认删除选中的${this.selectedKeys.length}项数据?`,
        onOk: () => this.$api.deleteUser('student', {
          ids: this.selectedKeys,
        }).then(() => {
          this.$message.success('删除成功!');
          this.selectedKeys.splice(0);
          this.getData();
        }).catch(e => {
          this.$message.error(e.msg || '删除失败!');
          throw e;
        }),
      });
    },
    exportAll() {
      // 导出所有数据
      this.exporting = true;
      this.$api.getUserList({
        ...this.query,
        type: 'student',
      }).then(data => {
        return exportExcel(data.data);
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '导出失败');
      }).finally(() => {
        this.exporting = false;
      });
    },
    grantRole(item) {
      // 授权角色
      let vnode;
      this.$confirm({
        title: '授权',
        content: () => (vnode = <GrantRole
          type="student"
          role={item.role_id}
          account={item.sid}
        />),
        onOk: async () => {
          await vnode.componentInstance.confirm();
          this.getData();
        },
      });
    },
  },
};

// 创建搜索选项
function createSearchOptions() {
  return [
    {
      label: '学号',
      key: 'sid',
      default: '',
      component: 'input',
    },
    {
      label: '姓名',
      key: 'name',
      default: '',
      component: 'input',
    },
    {
      label: '性别',
      key: 'sex',
      default: undefined,
      component: 'select',
      props: {
        options: sexes,
      },
    },
    {
      label: '年级',
      key: 'grade',
      default: undefined,
      component: 'select',
      props: {
        options: grades,
      },
    },
    {
      label: '班级',
      key: 'class',
      default: '',
      component: 'input',
    },
  ];
}
</script>
