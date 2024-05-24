import * as qiniu from 'qiniu-js';

// 配置对象，指定上传区域为华南区域
const config = {
  region: qiniu.region.z2,
};

/**
 * 表单上传文件
 * @param {string} name - 文件名
 * @param {Blob} file - 文件内容
 * @param {string} token - 鉴权token
 * @returns {object} - 返回上传对象
 */
export const uploader = function(name, file, token) {
  // 使用 qiniu-js 的 upload 方法上传文件
  // 参数分别是 文件内容(file)、文件名(name)、鉴权token、上传选项(null)、配置(config)
  return qiniu.upload(file, name, token, null, config);
};
