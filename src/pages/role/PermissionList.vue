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

    <!-- 权限列表表格 -->
    <AntTable
      :loading="loading"
      :bordered="false"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      @change="changePage"
    >
      <!-- 表头部分，包含添加权限按钮 -->
      <template #header>
        <a-button
          v-if="$has('permission:add')"
          type="primary"
          @click="addPermission"
        >
          <a-icon type="plus" />添加权限
        </a-button>
      </template>
    </AntTable>
  </div>
</template>

<script>
import { permissionTypes, actions } from '@/utils/const';
import EditPermission from '@/components/edit/EditPermission';

export default {
  name: 'PermissionList',
  metaInfo: {
    title: '权限管理',
  },
  data() {
    return {
      loading: false, // 是否正在加载数据
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
      this.$api.getPermissions({
        ...this.$refs.searchForm.getResult(),
        offset: this.current,
        limit: this.pageSize,
      }).then(data => {
        this.tableData = data.data;
        this.total = data.count;
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '获取数据失败');
      }).finally(() => {
        this.loading = false;
      });
    },
    addPermission() {
      // 添加权限
      let vnode;
      this.$confirm({
        title: '添加权限',
        content: h => (vnode = <EditPermission />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.addPermission(values).then(() => {
            this.getData();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '添加失败');
            throw e;
          });
        },
      });
    },
    edit(row) {
      // 编辑权限
      let vnode;
      this.$confirm({
        title: '编辑权限',
        content: h => (vnode = <EditPermission data={row} />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          values.id = row.id;
          return this.$api.updatePermission(values).then(() => {
            this.getData();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '修改失败');
            throw e;
          });
        },
      });
    },
    remove(row) {
      // 删除权限
      this.$modal.confirm({
        title: `确认删除 ${row.label}?`,
        onOk: () => this.$api.deletePermission([row.id]).then(() => {
          this.$message.success('删除成功');
          this.getData();
        }).catch(e => {
          console.error(e);
          this.$message.error(e.msg || '删除失败');
          throw e;
        }),
      });
    },
  },
};

// 创建搜索选项
function createSearchOptions() {
  return [
    {
      label: '权限编号',
      key: 'id',
      default: '',
      component: 'input',
    },
    {
      label: '权限名称',
      key: 'label',
      default: '',
      component: 'input',
    },
    {
      label: '权限类型',
      key: 'type',
      default: undefined,
      component: 'select',
      props: {
        options: permissionTypes,
      },
    },
    {
      label: '权限动作',
      key: 'action',
      default: undefined,
      component: 'select',
      props: {
        options: actions,
      },
    },
  ];
}

// 创建表格列
function createTableColumns(h) {
  return [
    { title: '编号', dataIndex: 'id' },
    { title: '权限名称', dataIndex: 'label' },
    { title: '权限类型', dataIndex: 'type' },
    {
      title: 'Action',
      dataIndex: 'action',
      customRender: action => <a-tag>{action}</a-tag>,
    },
    {
      title: '操作',
      width: 100,
      customRender: (row) => {
        const buttons = [
          this.$has('permission:update') && <a onClick={this.edit.bind(this, row)}>编辑</a>,
          this.$has('permission:delete') && <a onClick={this.remove.bind(this, row)}>删除</a>,
        ];
        return <div>{buttons}</div>;
      },
    },
  ];
}
</script>

<style scoped lang="stylus">
a:not(:last-child)
  margin-right 10px
</style>
