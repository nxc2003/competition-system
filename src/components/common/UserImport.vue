<template>
  <a-modal
    :visible="visible"
    :mask-closable="false"
    :body-style="{ padding: '10px' }"
    :destroy-on-close="true"
    :after-close="removeFile"
    title="导入数据"
    ok-text="确认导入"
    cancel-text="取消"
    centered
    @cancel="onCancel"
    @ok="onOk"
  >
    <a-button type="link" @click="writeTemplateFile">
      下载上传模板({{ type === "student" ? "学生" : "教师" }})
    </a-button>
    <a-upload
      accept=".xlsx,.xls"
      class="upload"
      :before-upload="getFile"
      :remove="removeFile"
    >
      <a-button> <a-icon type="upload" /> 点击上传表格 </a-button>
    </a-upload>

    <a-table
      size="small"
      style="margin-top: 10px"
      row-key="账号"
      :columns="columns"
      :data-source="result"
      :loading="uploading"
      :pagination="{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${result.length} 条记录`,
      }"
    />
  </a-modal>
</template>

<script>
import { uniq } from 'lodash-es'; // 从 lodash-es 中导入 uniq 函数
import { readExcel, makeExcel } from '@/utils/excel'; // 从 utils/excel 模块中导入 readExcel 和 makeExcel 函数
import { sexes, grades, ranks } from '@/utils/const'; // 从 utils/const 模块中导入 sexes, grades 和 ranks 常量
import DisplayFailedUser from '@/components/common/DisplayFailedUser'; // 导入 DisplayFailedUser 组件

// 生成映射对象的反向映射
const sexesRevertMap = mapRevert(sexes);
const gradesRevertMap = mapRevert(grades);
const rankRevertMap = mapRevert(ranks);

export default {
  name: 'UserImport', // 组件名称
  props: {
    type: {
      default: 'student', // 默认类型为 'student'
      require: true, // 必填项
      validator: value => ['student', 'teacher'].includes(value), // 验证类型是否为 'student' 或 'teacher'
    },
  },
  data() {
    return {
      visible: false, // 控制模态框的显示与隐藏
      uploading: false, // 控制上传状态
      result: [], // 存储上传的数据
    };
  },
  computed: {
    primaryKey() {
      return this.type === 'student' ? 'sid' : 'tid'; // 根据类型返回主键字段
    },
    keyMap() {
      return new Map(
        [
          ['账号', this.primaryKey],
          ['姓名', 'name'],
        ].concat(
          this.type === 'student'
            ? [['性别', 'sex'], ['年级', 'grade'], ['班级', 'class']]
            : [['职称', 'rank']],
        ),
      );
    },
    columns() {
      const cols = [];
      for (const key of this.keyMap.keys()) {
        cols.push({
          title: key, // 设置列标题
          dataIndex: key, // 设置列数据索引
        });
      }
      return cols;
    },
    transformedData() {
      const data = [];
      const strategy = {
        sex: label => sexesRevertMap[label.trim()],
        grade: label => gradesRevertMap[label.trim()],
        rank: label => rankRevertMap[label.trim()],
      };
      for (const item of this.result) {
        const temp = {};
        for (let [key, value] of Object.entries(item)) {
          key = this.keyMap.get(key.trim());
          const revert = strategy[key];
          temp[key] = typeof revert === 'function'
            ? revert(value)
            : value;
        }
        data.push(temp);
      }
      return data;
    },
  },
  methods: {
    getFile(file) {
      this.uploading = true; // 设置上传状态为 true
      const reader = new FileReader();
      reader.readAsBinaryString(file); // 读取文件为二进制字符串
      reader.onload = async e => {
        const result = await readExcel(e.target.result); // 读取 Excel 文件
        console.log(result);
        this.result = uniq(result, '账号'); // 去重数据

        this.uploading = false; // 设置上传状态为 false
        const diff = result.length - this.result.length;
        this.$message.success(
          diff > 0
            ? `账号不能重复，已去重${diff}条数据`
            : '文件读取成功',
        );
      };
      reader.onerror = e => {
        this.$message.error('文件读取失败'); // 文件读取失败提示
      };
      return false; // 阻止上传
    },
    removeFile() {
      this.result.splice(0); // 清空数据
    },
    onCancel() {
      if (!this.result.length) {
        this.visible = false; // 如果没有数据，则直接关闭模态框
        return;
      }
      const modal = this.$modal.confirm({
        title: '警告',
        content: '数据未保存，确认关闭？',
        onOk: () => {
          modal.destroy();
          this.visible = false;
        },
      });
    },
    onOk() {
      if (!this.result.length) {
        return this.$message.warn('暂无数据！'); // 如果没有数据，则提示暂无数据
      }
      this.$modal.confirm({
        title: '提示',
        content: '确认导入吗？',
        centered: true,
        onOk: () => this.$api.importUser(this.type, this.transformedData)
          .then(() => {
            this.$message.success('导入成功'); // 导入成功提示
            this.visible = false; // 关闭模态框
          }).catch(e => {
            const message = e.msg || '导入失败'; // 导入失败提示
            if (e.code === 1) {
              this.$confirm({
                title: message,
                content: () => <DisplayFailedUser
                  primaryKey={this.primaryKey}
                  users={this.result}
                  fail={e.data}
                />,
              });
            } else this.$message.error(message);
          }).finally(() => {
            this.$emit('refresh'); // 触发刷新事件
          }),
      });
    },
    writeTemplateFile() {
      makeExcel(({
        student: {
          header: [...this.keyMap.keys()],
          name: '学生上传模板.xlsx',
          data: [
            { 账号: '2022211908', 姓名: '宁显灿', 性别: '男', 年级: '大二', 班级: '04012203' },
            { 账号: '2022211916', 姓名: '余杰', 性别: '女', 年级: '大二', 班级: '04012208' },
          ],
        },
        teacher: {
          header: [...this.keyMap.keys()],
          name: '教师上传模板.xlsx',
          data: [
            { 工号: '10010', 姓名: '张三', 职称: '教授' },
            { 工号: '10086', 姓名: '李四', 职称: '副教授' },
          ],
        },
      })[this.type]);
    },
    /**
     * 外部调用方法
     */
    show() {
      this.visible = true; // 显示模态框
    },
  },
};

/**
 * label映射value
 * @param{Array} arr
 */
function mapRevert(arr) {
  const result = {};
  for (const { label, value } of arr) {
    result[label] = value;
  }
  return result;
}
</script>
