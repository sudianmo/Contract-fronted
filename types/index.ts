// 合同类型定义
export interface Contract {
  id?: number;
  contractNo: string;
  contractName: string;
  clientId: number;
  clientName?: string;
  amount: number;
  signDate: string;
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
  records: T[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  pages?: number;
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

// 产品类型定义
export interface Product {
  id?: number;
  productName: string;
  specification?: string;
  unitPrice: number;
  stockQuantity: number;
  category?: string;
  createTime?: string;
  updateTime?: string;
}

// 项目类型定义
export interface Project {
  id?: number;
  projectName: string;
  customerId: number;
  customerName?: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
}

// 支付类型定义
export interface Payment {
  id?: number;
  contractId: number;
  contractName?: string;
  paymentAmount: number;
  paymentDate: string;
  paymentMethod?: string;
  paymentStatus: string;
  remarks?: string;
  createTime?: string;
  updateTime?: string;
}

// 合同全量信息（视图）
export interface ContractFullInfo {
  contractId: number;
  contractNumber: string;
  contractName: string;
  contractAmount: number;
  signingDate: string;
  expiryDate: string;
  contractStatus: string;
  terms?: string;
  totalPayment: number;
  customerName: string;
  customerContact: string;
  customerPhone: string;
  projectName?: string;
  projectStatus?: string;
  contractManager: string;
  managerDepartment: string;
  approvalStatus?: string;
  approvalDate?: string;
}

// 部门业绩统计
export interface DepartmentPerformance {
  department: string;
  contractCount: number;
  totalContractAmount: number;
  totalPaidAmount: number;
  contractYear: number;
  topManager: string;
}

// 产品销售统计
export interface ProductSalesStats {
  productId: number;
  productName: string;
  productCategory: string;
  standardPrice: number;
  totalSalesQuantity: number;
  totalSalesAmount: number;
  supplierName: string;
  supplyPrice: number;
  grossProfit: number;
}

// 项目任务进度
export interface ProjectTaskProgress {
  projectId: number;
  projectName: string;
  customerId: number;
  customerName: string;
  budget: number;
  projectStatus: string;
  projectStartDate: string;
  projectEndDate: string;
  taskId: number;
  taskName: string;
  taskDescription?: string;
  taskStartDate: string;
  taskEndDate: string;
  taskStatus: string;
  completionRate: number;
  taskAssignee: string;
  assigneeDepartment: string;
  contractNumber: string;
  contractName: string;
  contractAmount: number;
}

// 用户类型定义
export interface User {
  userId: number;
  username: string;
  createdAt: string;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}
