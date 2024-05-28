<template>
  <div>
    <!-- SearchForm 组件用于实现搜索功能 -->
    <SearchForm
      ref="searchForm"
      :loading="loading"
      :options="searchOptions"
      @search="search"
      @reset="search"
    />

    <!-- AntTable 组件用于显示赛事信息表格 -->
    <AntTable
      v-model="selectedKeys"
      row-key="race_id"
      :loading="loading"
      :data-source="races"
      :pagination="pagination"
      :columns="tableColumns"
      @change="changePage"
    >
      <!-- 表格头部定义，包含添加、批量删除和导出按钮 -->
      <template #header>
        <a-button-group>
          <a-button v-if="$has('race:add')" type="primary" @click="addRace">
            添加赛事
          </a-button>
          <a-button
            v-if="$has('race:delete')"
            :disabled="!selectedKeys.length"
            @click="batchDelete"
          >
            批量删除 ({{ selectedKeys.length }})
          </a-button>
          <a-button
            v-if="$has('race:export')"
            :loading="exporting"
            @click="exportAll"
          >
            全量导出
          </a-button>
        </a-button-group>
      </template>
      <!-- 表格行操作定义，包括成绩录入、编辑和删除 -->
      <template #action="record">
        <a-space>
          <!-- 成绩录入 -->
          <a-tooltip v-if="isStudent || $has('record:add')" title="成绩录入">
            <a @click="addRecord(record)">
              <a-icon type="plus-circle" />
            </a>
          </a-tooltip>

          <!--编辑-->
          <a v-if="$has('race:update')" @click="editRace(record)">
            <a-icon type="edit" />
          </a>

          <!--删除-->
          <a-popconfirm
            v-if="$has('race:delete')"
            title="确认删除？"
            placement="left"
            @confirm="deleteRace(record)"
          >
            <template #icon>
              <a-icon type="question-circle-o" style="color: orange" />
            </template>
            <a><a-icon type="delete" /></a>
          </a-popconfirm>
        </a-space>
      </template>
    </AntTable>
  </div>
</template>

<script>
import { raceLevelMap, raceLevels } from '@/utils/const'; // 导入赛事级别的映射和列表
import { exportData } from '@/utils/excel'; // 导入 Excel 导出函数
import EditRace from '@/components/edit/EditRace'; // 导入编辑赛事组件
import AddRecord from '@/components/record/AddRecord'; // 导入添加记录组件

export default {
  name: 'Race', // 组件名称
  metaInfo: { // 页面元信息
    title: '赛事管理',
  },
  data() {
    return {
      selectedKeys: [], // 被选中的行的 key 数组
      loading: false, // 表示表格数据是否在加载中
      exporting: false, // 表示是否正在导出数据
      races: [], // 赛事数据数组
      current: 1, // 当前页码
      pageSize: 10, // 每页显示的记录数
      total: 0, // 总记录数
      tableColumns: createTableColumns.call(this), // 表格列的配置
      searchOptions: createSearchOptions.call(this), // 搜索表单的配置
    };
  },
  computed: {
    pagination() { // 计算分页参数
      return {
        current: this.current,
        pageSize: this.pageSize,
        total: this.total,
      };
    },
    isStudent() { // 判断当前用户是否为学生
      return this.$store.state.user.identity === 'student' || false;
    },
  },
  mounted() {
    this.$watch(() => [this.pageSize, this.current], this.getData, { immediate: true });
  },
  methods: {
    changePage({ pageSize, current }) { // 分页、排序、筛选变化时触发
      Object.assign(this, { pageSize, current });
    },
    search() { // 搜索表单提交
      this.current = 1;
      this.getData();
    },
    getData() { // 获取赛事数据
      this.loading = true;
      this.$api.getRaceList({
        ...this.$refs.searchForm.getResult(),
        offset: this.current,
        limit: this.pageSize,
      }).then(data => {
        this.races = data.data;
        this.total = data.count;
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '获取数据失败');
      }).finally(() => {
        this.loading = false;
      });
    },
    addRace() { // 添加赛事
      let vnode;
      this.$confirm({
        title: '新增赛事',
        content: h => (vnode = <EditRace />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.addRace(values).then(data => {
            this.$message.success(data.msg);
            this.getData();
          }).catch(e => {
            this.$message.error(e.msg || '添加失败');
            throw e;
          });
        },
      });
    },
    editRace(race) { // 编辑赛事
      let vnode;
      this.$confirm({
        title: '编辑赛事',
        content: h => (vnode = <EditRace data={race} />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          values.race_id = race.race_id;
          return this.$api.updateRace(values).then(data => {
            this.$message.success(data.msg);
            this.getData();
          }).catch(e => {
            this.$message.error(e.msg || '修改失败');
            throw e;
          });
        },
      });
    },
    deleteRace(race) { // 删除赛事
      this.loading = true;
      this.$api.deleteRace([race.race_id]).then(data => {
        this.$message.success(data.msg);
        this.getData();
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '删除失败');
      }).finally(() => {
        this.loading = false;
      });
    },
    batchDelete() { // 批量删除赛事
      this.$modal.confirm({
        title: `确认删除选中的${this.selectedKeys.length}项数据?`,
        onOk: () => this.$api.deleteRace(this.selectedKeys)
          .then(() => {
            this.$message.success('删除成功!');
            this.selectedKeys.splice(0);
            this.getData();
          }).catch(e => {
            this.$message.error(e.msg || '删除失败!');
            throw e;
          }),
      });
    },
    addRecord(race) { // 添加记录
      let vnode;
      this.$confirm({
        title: '成绩录入',
        content: h => (vnode = <AddRecord />),
        onOk: async () => {
          const form = vnode.componentInstance;
          const values = await form.validate();
          return this.$api.addRecord({
            race_id: race.race_id,
            sid: this.$store.state.user.account,
            score: values.score,
            tid: values.tid,
          }).then(data => {
            this.$message.success(data.msg);
          }).catch(e => {
            this.$message.error(e.msg || '系统错误');
            throw e;
          });
        },
      });
    },
    exportAll() { // 全量导出
      this.exporting = true;
      this.$api.getRaceList(this.query).then(data => {
        return exportData(data.data);
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '导出失败');
      }).finally(() => {
        this.exporting = false;
      });
    },
  },
};

function createTableColumns() {
  return [
    { title: '赛事名称', dataIndex: 'title' },
    { title: '级别', customRender: record => raceLevelMap[record.level] },
    { title: '类别', dataIndex: 'type' },
    { title: '主办方', dataIndex: 'sponsor' },
    { title: '举办时间', dataIndex: 'date' },
    { title: '地点', dataIndex: 'location' },
    { title: '描述', dataIndex: 'description' },
    {
      title: '操作',
      align: 'center',
      scopedSlots: { customRender: 'action' },
    },
  ];
}

function createSearchOptions() {
  return [
    {
      label: '赛事名称',
      key: 'title',
      default: '',
      component: 'input',
    },
    {
      label: '主办方',
      key: 'sponsor',
      default: '',
      component: 'input',
    },
    {
      label: '地点',
      key: 'location',
      default: '',
      component: 'input',
    },
    {
      label: '类别',
      key: 'type',
      default: undefined,
      component: 'select',
      props: {
        options: ['A', 'B', 'C', 'D', 'E', 'F'].map(key => ({
          label: key,
          value: key,
        })),
      },
    },
    {
      label: '级别',
      key: 'level',
      default: undefined,
      component: 'select',
      props: {
        options: raceLevels,
      },
    },
    {
      label: '举办时间',
      key: 'date',
      default: () => [],
      mapper: ({ date }) => date.join('~'),
      component: 'range-picker',
    },
  ];
}

</script>
