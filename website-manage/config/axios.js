import axios from 'axios';
import { message } from 'ant-design-vue';
import router from './router';

const instance = axios.create();
instance.CancelToken = axios.CancelToken;
const toLogin = () => {
  if (router.currentRoute.fullPath !== '/login') {
    router.replace({ path: '/login' });
  }
};

const errorHandle = (status) => {
  switch (status) {
    case 401:
      toLogin();
      break;
    case 500:
      message.error('服务器响应异常');
      break;
    default:
  }
};

instance.interceptors.request.use((config) => config, (error) => Promise.reject(error));

instance.interceptors.response.use((response) => Promise.resolve(response), (error) => {
  const {
    response,
  } = error;
  if (response) {
    errorHandle(response.status);
    return Promise.reject(response);
  }
  return Promise.reject(response);
});

export default instance;
