export const grades = [
  { label: '大一', value: 1 }, // 定义年级，大一，对应值为1
  { label: '大二', value: 2 }, // 定义年级，大二，对应值为2
  { label: '大三', value: 3 }, // 定义年级，大三，对应值为3
  { label: '大四', value: 4 }, // 定义年级，大四，对应值为4
];
export const gradeMap = map(grades); // 创建年级映射表

export const ranks = [
  { label: '其他', value: 0 }, // 定义职称，其他，对应值为0
  { label: '教授', value: 1 }, // 定义职称，教授，对应值为1
  { label: '副教授', value: 2 }, // 定义职称，副教授，对应值为2
  { label: '讲师', value: 3 }, // 定义职称，讲师，对应值为3
];
export const rankMap = map(ranks); // 创建职称映射表

export const sexes = [
  { label: '男', value: 1 }, // 定义性别，男，对应值为1
  { label: '女', value: 0 }, // 定义性别，女，对应值为0
];
export const sexMap = map(sexes); // 创建性别映射表

export const raceLevels = [
  { label: '校级', value: 1 }, // 定义赛事级别，校级，对应值为1
  { label: '省级', value: 2 }, // 定义赛事级别，省级，对应值为2
  { label: '国家级一般', value: 3 }, // 定义赛事级别，国家级一般，对应值为3
  { label: '国家级重点', value: 4 }, // 定义赛事级别，国家级重点，对应值为4
];
export const raceLevelMap = map(raceLevels); // 创建赛事级别映射表

// 定义一个函数，用于将标签值数组转换为对象映射
function map(arr) {
  const result = {}; // 创建一个空对象用于存储映射
  for (const { label, value } of arr) { // 遍历数组
    result[value] = label; // 将数组元素的值作为键，标签作为值，存入对象
  }
  return result; // 返回创建的映射对象
}

export const permissionTypes = [
  'user', // 权限类型：用户
  'race', // 权限类型：赛事
  'record', // 权限类型：记录
  'role', // 权限类型：角色
  'permission', // 权限类型：权限
].map(key => ({
  label: key, // 使用权限类型作为标签
  value: key, // 使用权限类型作为值
}));

export const actions = [
  'add', // 操作类型：添加
  'delete', // 操作类型：删除
  'update', // 操作类型：更新
  'query', // 操作类型：查询
  'import', // 操作类型：导入
  'export', // 操作类型：导出
].map(key => ({
  label: key, // 使用操作类型作为标签
  value: key, // 使用操作类型作为值
}));
