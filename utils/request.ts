import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 假设后端返回格式为 { code, message, data }
    if (res.code !== 200) {
      console.error('请求错误:', res.message);
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res.data;
  },
  (error) => {
    const backendMsg = error?.response?.data?.message;
    const msg = backendMsg || error?.message || '请求异常';
    console.error('请求异常:', msg);
    return Promise.reject(new Error(msg));
  }
);

export default request;
