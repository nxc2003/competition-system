import { isFunction, has } from 'lodash-es';

// 定义一个包含 null、undefined 和空字符串的集合
export const emptySet = new Set([null, undefined, '']);

// 根据是否是函数来获取默认值，如果是函数则执行它，不是函数则直接返回默认值
export const getValue = function(def, params = {}) {
  return isFunction(def)
    ? def(params) // 如果 def 是函数，则调用它并传递参数 params
    : def; // 如果 def 不是函数，则直接返回它
};

// 获取选项的默认值
export function getDefaultValue(option, params = {}) {
  const data = {};

  // 如果 option 对象中有 key 和 default 属性，则获取默认值并存储在 data 对象中
  if (has(option, 'key') && has(option, 'default')) {
    data[option.key] = getValue(option.default, params);
  }

  const { label } = option;
  // 如果 label 对象中有 key 和 default 属性，则获取默认值并存储在 data 对象中
  if (has(label, 'key') && has(label, 'default')) {
    data[label.key] = getValue(label.default, params);
  }

  return data; // 返回包含默认值的 data 对象
}

// 为事件处理函数注入参数
export function getInjectedEvents(on = {}, ...params) {
  const events = {};
  for (const key of Object.keys(on)) {
    const handler = on[key];
    if (isFunction(handler)) {
      // 注入参数并绑定处理函数
      events[key] = handler.bind(Object.create(null), ...params);
    } else {
      console.error(`Invalid event handler! '${key}' must be a function`); // 打印错误信息
    }
  }
  return events; // 返回注入参数后的事件处理函数对象
}

// 检查数据是否为空
export const notEmpty = data => !emptySet.has(data);

// 根据条件过滤对象的属性
export function getFilterData(obj, condition = notEmpty) {
  const result = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (condition(value, key)) {
      result[key] = value; // 如果满足条件则将键值对存储在结果对象中
    }
  }
  return result; // 返回过滤后的结果对象
}
