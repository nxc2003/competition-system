<template>
  <div>
    <!-- 搜索表单 -->
    <SearchForm
      ref="searchForm"
      :options="searchOptions"
      :loading="loading"
      @search="search"
      @reset="search"
    />

    <!-- 角色列表表格 -->
    <AntTable
      :loading="loading"
      :bordered="false"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :scroll="{ x: 500 }"
      @change="changePage"
    >
      <!-- 表头部分，包含添加角色按钮 -->
      <template #header>
        <a-button v-if="$has('role:add')" type="primary" @click="addRole">
          <a-icon type="plus" />添加角色
        </a-button>
      </template>
      <!-- 展开的行内容，显示角色的权限 -->
      <template #expandedRowRender="record">
        <div
          class="permissions"
          v-for="(items, type) in group(record.permissions)"
          :key="type"
        >
          <span class="title">{{ type }}</span>
          <div class="tag-container">
            <a-tag
              v-for="({ label, action }, index) in items"
              :key="index"
              color="green"
            >
              {{ `${label}(${action})` }}
            </a-tag>
          </div>
        </div>
      </template>
    </AntTable>
  </div>
</template>

<script>
import EditRole from '@/components/edit/EditRole';

export default {
  name: 'RoleList',
  metaInfo: {
    title: '角色管理', // 页面标题
  },
  data() {
    return {
      loading: false, // 加载状态
      current: 1, // 当前页码
      pageSize: 10, // 每页显示的记录数
      total: 0, // 总记录数
      tableData: [], // 表格数据
      searchOptions: createSearchOptions.call(this), // 搜索选项
      columns: createTableColumns.call(this, this.$createElement), // 表格列配置
    };
  },
  computed: {
    pagination() {
      return {
        current: this.current,
        pageSize: this.pageSize,
        total: this.total,
      };
    },
  },
  mounted() {
    // 监听分页信息的变化，立即获取数据
    this.$watch(() => [this.pageSize, this.current], this.getData, { immediate: true });
  },
  methods: {
    changePage({ pageSize, current }) {
      // 更新分页信息并获取数据
      Object.assign(this, { pageSize, current });
    },
    search() {
      // 执行搜索操作时重置当前页码并获取数据
      this.current = 1;
      this.getData();
    },
    getData() {
      // 获取数据
      this.loading = true;
      this.$api.getRoles({
        ...this.$refs.searchForm.getResult(),
        offset: this.current,
        limit: this.pageSize,
      }).then(data => {
        this.tableData = data.data;
        this.total = data.count;
      }).catch(e => {
        this.$message.error(e.msg || '获取角色列表失败');
      }).finally(() => {
        this.loading = false;
      });
    },
    addRole() {
      // 添加角色
      let vnode;
      this.$drawer({
        title: '添加角色',
        content: h => (vnode = <EditRole />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.addRole(values).then(() => {
            this.search();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '添加失败');
            throw e;
          });
        },
      });
    },
    edit(row) {
      // 编辑角色
      let vnode;
      this.$drawer({
        title: '编辑角色',
        content: h => (vnode = <EditRole data={row} />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          values.id = row.id;
          return this.$api.updateRole(values).then(() => {
            this.search();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '修改失败');
            throw e;
          });
        },
      });
    },
    remove(row) {
      // 删除角色
      this.$modal.confirm({
        title: `确认删除 ${row.label}?`,
        onOk: () => this.$api.deleteRole([row.id]).then(() => {
          this.$message.success('删除成功');
          this.search();
        }).catch(e => {
          console.error(e);
          this.$message.error(e.msg || '删除失败');
          throw e;
        }),
      });
    },
    group(permissions) {
      // 按权限类型分组
      const result = {};
      for (const { type, action, label } of permissions) {
        const item = { action, label };
        if (!result[type]) result[type] = [];
        result[type].push(item);
      }
      return result;
    },
  },
};

// 创建搜索选项
function createSearchOptions() {
  return [
    {
      label: '角色编号',
      key: 'id',
      default: '',
      component: 'input',
    },
    {
      label: '角色名称',
      key: 'label',
      default: '',
      component: 'input',
    },
    {
      label: '角色描述',
      key: 'description',
      default: '',
      component: 'input',
    },
  ];
}

// 创建表格列
function createTableColumns(h) {
  return [
    { title: '角色编号', dataIndex: 'id', width: 80 },
    { title: '角色名称', dataIndex: 'label', ellipsis: true },
    { title: '角色描述', dataIndex: 'description' },
    {
      title: '操作',
      width: 100,
      customRender: (row) => {
        const buttons = [
          this.$has('role:update') && <a onClick={this.edit.bind(this, row)}>编辑</a>,
          this.$has('role:delete') && <a onClick={this.remove.bind(this, row)}>删除</a>,
        ];
        return <div>{buttons}</div>;
      },
    },
  ];
}
</script>

<style scoped lang="stylus">
.permissions
  display flex
  align-items center
  &:not(:last-child)
    margin-bottom 10px
  & > .title
    align-self flex-start
    display inline-block
    min-width 80px
  & >>> .ant-tag
    cursor pointer
    margin-bottom 5px

a:not(:last-child)
  margin-right 10px
</style>
