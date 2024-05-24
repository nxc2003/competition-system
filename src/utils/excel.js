// 异步加载 xlsx 模块
export async function getXlsx() {
  // 使用 webpackChunkName 动态导入 'xlsx' 模块
  const v = await import(/* webpackChunkName: "xlsx" */ 'xlsx');
  // 返回导入的模块的默认导出
  return v.default;
}

/**
 * 下载表格数据
 * @param {Object} config - 配置对象
 */
export async function makeExcel(config = {}) {
  // 获取 xlsx 模块
  const XLSX = await getXlsx();
  // 解构配置对象中的属性，并提供默认值
  const {
    name = 'data.xlsx', // 文件名，默认 'data.xlsx'
    data = [], // 表格数据，默认空数组
    header = [], // 表头，默认空数组
  } = config;

  // 创建一个新的工作簿
  const workbook = XLSX.utils.book_new();
  // 将 JSON 数据转换为工作表
  const worksheet = XLSX.utils.json_to_sheet(data, { header });
  // 将工作表添加到工作簿中
  XLSX.utils.book_append_sheet(workbook, worksheet);
  // 将工作簿写入文件
  XLSX.writeFile(workbook, name.endsWith('.xlsx') ? name : `${name}.xlsx`);
}

/**
 * 读取 excel 文件，转换为 json 数据
 * @param {BinaryString} data - 二进制字符串数据
 * @returns {Object[]} - 返回转换后的 JSON 数据数组
 */
export async function readExcel(data) {
  // 获取 xlsx 模块
  const XLSX = await getXlsx();
  // 读取 excel 数据，生成工作簿对象
  const workbook = XLSX.read(data, { type: 'binary' });
  const { SheetNames } = workbook;
  // 获取第一张工作表
  const sheet = workbook.Sheets[SheetNames[0]];
  // 将工作表数据转换为 JSON 格式
  return XLSX.utils.sheet_to_json(sheet);
}

/**
 * 基于 makeExcel 封装，将表格数据导出的函数
 * @param {Object} config - 配置对象
 */
export function exportData(config) {
  const { data, header, name, keyMap } = config;
  return makeExcel({
    name,
    header,
    data: data.map(v => {
      const result = {};
      for (const [key, value] of Object.entries(v)) {
        let name = keyMap[key];
        let convert = value => value;
        if (Array.isArray(name)) {
          [name, convert] = name;
        }
        if (name) {
          result[name] = convert(value);
        }
      }
      return result;
    }),
  });
}
