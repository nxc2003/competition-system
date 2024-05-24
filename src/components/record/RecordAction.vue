<template>
  <a-space>
    <!-- 判断用户是否有更新记录的权限，有则显示编辑图标 -->
    <a v-if="$has('record:update')" @click="editRecord">
      <a-icon type="edit" />
    </a>
    <!-- 判断用户是否有删除记录的权限，有则显示删除确认组件 -->
    <DelPopConfirm v-if="$has('record:delete')" @confirm="deleteRecord" />
  </a-space>
</template>

<script>
import AuditRecord from '@/components/record/AuditRecord'; // 引入审核记录组件

export default {
  name: 'RecordAction', // 组件名称
  props: {
    record: {
      type: Object,
      required: true, // record属性必需传递
    },
    freshData: {
      type: Function,
      default() {}, // freshData属性默认为空函数
    },
  },
  computed: {
    identity() {
      return this.$store.state.user.identity; // 从store中获取用户身份
    },
  },
  methods: {
    deleteRecord() {
      // 调用API删除记录
      this.$api.deleteRecord([this.record.record_id]).then(data => {
        this.$message.success(data.msg); // 删除成功消息提示
        this.freshData(); // 刷新数据
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '删除失败'); // 删除失败消息提示
      });
    },
    editRecord() {
      // 根据用户身份调用不同的编辑方法
      if (this.identity === 'student') {
        this.studentEditRecord();
      } else {
        this.auditRecord();
      }
    },
    studentEditRecord() {
      let score = this.record.score; // 初始成绩
      // 弹出确认框用于修改成绩
      this.$confirm({
        title: '修改成绩',
        content: h => (
          <a-form-model>
            <a-form-model-item required={true} label="成绩录入">
              <a-input
                value={score}
                placeholder="请输入比赛成绩"
                onInput={e => { score = e.target.value; }}
              />
            </a-form-model-item>
          </a-form-model>
        ),
        onOk: () => {
          let msg;
          score = score.trim(); // 去除成绩两端的空格
          // 验证输入的成绩
          if (!score) {
            msg = '请输入成绩';
          } else if (this.record.score === score) {
            msg = '未检测到变动';
          }
          if (msg) {
            this.$message.warn(msg);
            throw new Error(msg); // 抛出错误，阻止确认框关闭
          }
          // 调用API更新成绩
          return this.$api.updateRecord({
            record_id: this.record.record_id,
            score,
          }).then(() => {
            this.$message.success('修改成功'); // 修改成功消息提示
            this.freshData(); // 刷新数据
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '修改失败'); // 修改失败消息提示
            throw e;
          });
        },
      });
    },
    auditRecord() {
      let vnode;
      // 弹出确认框用于审核记录
      this.$confirm({
        title: '审核',
        content: h => (vnode = <AuditRecord record={this.record} />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate(); // 获取审核结果
          // 调用API更新审核状态
          return this.$api.updateRecord({
            record_id: this.record.record_id,
            status: values.status,
            description: values.description,
          }).then(() => {
            this.$message.success('提交成功'); // 提交成功消息提示
            this.freshData(); // 刷新数据
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '提交失败'); // 提交失败消息提示
            throw e;
          });
        },
      });
    },
  },
};
</script>
