// 定义一个对象 columns，用于存储学生和教师的列配置
const columns = {
  student: [
    {
      title: '学号',  // 列标题
      dataIndex: 'account',  // 对应的数据字段
      sort: (a, b) => a.account - b.account,  // 排序函数，根据学号排序
    },
    {
      title: '密码',  // 列标题
      dataIndex: 'password',  // 对应的数据字段
    },
    {
      title: '姓名',  // 列标题
      dataIndex: 'name',  // 对应的数据字段
    },
    {
      title: '性别',  // 列标题
      dataIndex: 'sex',  // 对应的数据字段
    },
    {
      title: '年级',  // 列标题
      dataIndex: 'grade',  // 对应的数据字段
    },
    {
      title: '班级',  // 列标题
      dataIndex: 'classname',  // 对应的数据字段
    },
  ],
  teacher: [
    {
      title: '工号',  // 列标题
      dataIndex: 'account',  // 对应的数据字段
      sort: (a, b) => a.account - b.account,  // 排序函数，根据工号排序
    },
    {
      title: '密码',  // 列标题
      dataIndex: 'password',  // 对应的数据字段
    },
    {
      title: '姓名',  // 列标题
      dataIndex: 'name',  // 对应的数据字段
    },
    {
      title: '职称',  // 列标题
      dataIndex: 'rank',  // 对应的数据字段
    },
    {
      title: '描述',  // 列标题
      dataIndex: 'description',  // 对应的数据字段
    },
  ],
};

// 获取 columns 对象的所有键，存储到 types 数组中
const types = Object.keys(columns);

// 导出一个函数，接收 type 参数
export default function(type) {
  // 如果 type 不在 types 数组中，抛出错误
  if (!types.includes(type)) {
    throw new Error(`type must in ${types.toString()}`);
  }
  // 返回对应类型的列配置
  return columns[type];
}
