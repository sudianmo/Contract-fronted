import request from '@/utils/request';
import type { User, LoginRequest } from '@/types';

// 用户登录
export const login = (data: LoginRequest) => {
  return request.post<any, User>('/api/users/login', data);
};

// 检查登录状态
export const checkAuth = () => {
  const token = localStorage.getItem('user');
  return token ? JSON.parse(token) : null;
};

// 退出登录
export const logout = () => {
  localStorage.removeItem('user');
};
