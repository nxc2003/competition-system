// 从 ant-design-vue 导入 message 组件，用于显示通知消息
import { message } from 'ant-design-vue';
// 导入 axios 库，用于发送 HTTP 请求
import axios from 'axios';
// 导入 Vuex 的 store 实例，用于访问全局状态
import store from '@/store';
// 创建一个 axios 实例，并设置默认配置
const http = axios.create({
  baseURL: 'http://localhost:8081', // 设置基础 URL
});
// 请求拦截器，在每次请求前添加 token 到请求头
http.interceptors.request.use(config => {
  // 如果请求头中没有 authorization 字段且 Vuex 中存在 token
  if (!config.headers.authorization && store.state.token) {
    // 在请求头中添加 token
    config.headers.authorization = store.state.token;
  }
  return config; // 返回配置
});
// 响应拦截器，处理响应数据
http.interceptors.response.use(
  // 成功响应处理
  ({ data }) => {
    const { code } = data; // 从响应数据中解构出 code
    if (code === 200) return data; // 如果响应码是 200，直接返回数据
    console.error(data); // 否则打印错误信息
    throw data; // 抛出错误信息
  },
  // 错误响应处理
  e => {
    if (!navigator.onLine) {
      message.error('网络未连接'); // 如果网络未连接，显示错误消息
    }
    throw e; // 抛出错误信息
  },
);

// 导出配置好的 axios 实例
export default http;
