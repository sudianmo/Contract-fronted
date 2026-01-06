import request from '@/utils/request';
import type { Client, ClientQueryParams, PageResult, Contract } from '@/types';

// 获取客户列表
export const getClientList = (params: ClientQueryParams) => {
  return request.get<any, PageResult<Client>>('/api/clients', { params });
};

// 获取单个客户
export const getClient = (id: number) => {
  return request.get<any, Client>(`/api/clients/${id}`);
};

// 创建客户
export const createClient = (data: Client) => {
  return request.post<any, Client>('/api/clients', data);
};

// 更新客户
export const updateClient = (id: number, data: Client) => {
  return request.put<any, Client>(`/api/clients/${id}`, data);
};

// 部分更新客户
export const patchClient = (id: number, data: Partial<Client>) => {
  return request.patch<any, Client>(`/api/clients/${id}`, data);
};

// 删除客户
export const deleteClient = (id: number) => {
  return request.delete<any, void>(`/api/clients/${id}`);
};

// 获取客户的所有合同
export const getClientContracts = (id: number) => {
  return request.get<any, Contract[]>(`/api/clients/${id}/contracts`);
};
