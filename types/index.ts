// 合同类型定义
export interface Contract {
  id?: number;
  contractNo: string;
  contractName: string;
  clientId: number;
  clientName?: string;
  amount: number;
  signDate: string;
  startDate: string;
  endDate: string;
  status: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}

// 客户类型定义
export interface Client {
  id?: number;
  clientName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  address?: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}

// 分页参数
export interface PageParams {
  pageNum: number;
  pageSize: number;
}

// 分页响应
export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
}

// 合同查询参数
export interface ContractQueryParams extends PageParams {
  keyword?: string;
  status?: string;
  clientId?: number;
}

// 客户查询参数
export interface ClientQueryParams extends PageParams {
  keyword?: string;
}
