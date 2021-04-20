import { message } from 'ant-design-vue';
import axios from 'axios';
import store from '../store';
import router from '../router';

const http = axios.create({
  baseURL: '/api',
});

// 请求携带token
http.interceptors.request.use(config => {
  if (!config.headers.authorization && store.state.token) {
    config.headers.authorization = store.state.token;
  }
  return config;
});

http.interceptors.response.use(({ data }) => {
  const { code } = data;
  if (code === 403) {
    message.destroy();
    store.commit('logout');
    router
      .replace({ name: 'login' })
      .catch(console.warn)
      .finally(() => {
        message.warn('身份凭证过期，请重新登录');
      });
  }
  if (code === 200) return data;
  console.error(data);
  throw data;
}, e => {
  if (!navigator.onLine) {
    message.error('网络未连接');
  }
  throw e;
});

export default http;
