import request from '@/utils/request';
import type { DepartmentPerformance, ProductSalesStats, ProjectTaskProgress, PageResult } from '@/types';

// 获取部门业绩统计（按年度）
export const getDepartmentPerformanceByYear = (year: number) => {
  return request.get<any, DepartmentPerformance[]>(`/api/departments/performance/year/${year}`);
};

// 获取产品销售统计（分页）
export const getProductSalesStats = (params: { pageNum: number; pageSize: number }) => {
  return request.get<any, PageResult<ProductSalesStats>>('/api/products/sales-stats', { params });
};

// 获取项目任务进度（分页）
export const getProjectTaskProgress = (params: { pageNum: number; pageSize: number }) => {
  return request.get<any, PageResult<ProjectTaskProgress>>('/api/projects/task-progress', { params });
};
