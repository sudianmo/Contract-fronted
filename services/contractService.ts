import request from '@/utils/request';
import type { Contract, ContractQueryParams, PageResult } from '@/types';

// 获取合同列表
export const getContractList = (params: ContractQueryParams) => {
  return request.get<any, PageResult<Contract>>('/api/contracts', { params });
};

// 获取单个合同
export const getContract = (id: number) => {
  return request.get<any, Contract>(`/api/contracts/${id}`);
};

// 创建合同
export const createContract = (data: Contract) => {
  return request.post<any, Contract>('/api/contracts', data);
};

// 更新合同
export const updateContract = (id: number, data: Contract) => {
  return request.put<any, Contract>(`/api/contracts/${id}`, data);
};

// 部分更新合同
export const patchContract = (id: number, data: Partial<Contract>) => {
  return request.patch<any, Contract>(`/api/contracts/${id}`, data);
};

// 删除合同
export const deleteContract = (id: number) => {
  return request.delete<any, void>(`/api/contracts/${id}`);
};
