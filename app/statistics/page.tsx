"use client";

import React, { useState, useEffect } from "react";
import { Card, Spin, message, Tabs } from "antd";
import {
  BarChartOutlined,
  DollarOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getDepartmentPerformanceByYear,
  getProductSalesStats,
  getProjectTaskProgress,
} from "@/services/statsService";
import type {
  DepartmentPerformance,
  ProductSalesStats,
  ProjectTaskProgress,
} from "@/types";

const { TabPane } = Tabs;

// 任务状态映射（英文转中文）
const taskStatusMap: { [key: string]: string } = {
  "Completed": "已完成",
  "In Progress": "进行中",
  "To Do": "未开始",
  "Pending": "未开始",
};

// 获取中文状态
const getChineseStatus = (status: string): string => {
  return taskStatusMap[status] || status;
};

const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [deptStats, setDeptStats] = useState<DepartmentPerformance[]>([]);
  const [productStats, setProductStats] = useState<ProductSalesStats[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectTaskProgress[]>([]);
  const [activeTab, setActiveTab] = useState("department");

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    setLoading(true);
    try {
      const [deptData, productData, projectData] = await Promise.all([
        getDepartmentPerformanceByYear(2024),
        getProductSalesStats({ pageNum: 1, pageSize: 10 }),
        getProjectTaskProgress({ pageNum: 1, pageSize: 20 }),
      ]);
      setDeptStats(deptData);
      setProductStats(productData.records || []);
      setProjectStats(projectData.records || []);

      // 调试：输出任务状态
      console.log("项目任务状态统计：", {
        总数: projectData.records?.length || 0,
        状态分布: projectData.records?.reduce((acc: any, task: any) => {
          acc[task.taskStatus] = (acc[task.taskStatus] || 0) + 1;
          return acc;
        }, {}),
      });
    } catch (error) {
      message.error("加载统计数据失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 计算最大值用于条形图宽度
  const maxDeptAmount = Math.max(
    ...deptStats.map((d) => d.totalContractAmount),
    1
  );
  const maxProductAmount = Math.max(
    ...productStats.map((p) => p.totalSalesAmount),
    1
  );

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#FFFFFF",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <BarChartOutlined style={{ color: "#3B82F6" }} />
          数据统计分析
        </h1>
        <p style={{ color: "#E5E7EB", fontSize: 14, margin: "8px 0 0 0" }}>
          2024年度业绩概览与产品销售分析
        </p>
      </div>

      {/* Tab切换 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: "16px 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ProjectOutlined />
              部门业绩统计
            </span>
          }
          key="department"
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ padding: "24px 0" }}>
              {/* 概览卡片 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}
                  >
                    总合同数
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#3B82F6" }}
                  >
                    {deptStats.reduce((sum, d) => sum + d.contractCount, 0)}
                  </div>
                  <div style={{ fontSize: 12, color: "#34C759", marginTop: 4 }}>
                    份
                  </div>
                </Card>
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}
                  >
                    总合同金额
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#3B82F6" }}
                  >
                    ¥
                    {(
                      deptStats.reduce(
                        (sum, d) => sum + d.totalContractAmount,
                        0
                      ) / 10000
                    ).toFixed(1)}
                  </div>
                  <div style={{ fontSize: 12, color: "#34C759", marginTop: 4 }}>
                    万元
                  </div>
                </Card>
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}
                  >
                    已回款金额
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#34C759" }}
                  >
                    ¥
                    {(
                      deptStats.reduce((sum, d) => sum + d.totalPaidAmount, 0) /
                      10000
                    ).toFixed(1)}
                  </div>
                  <div style={{ fontSize: 12, color: "#34C759", marginTop: 4 }}>
                    万元
                  </div>
                </Card>
              </div>

              {/* 部门业绩竖向条形图总览 */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 32,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1D1D1F",
                    marginBottom: 24,
                  }}
                >
                  部门业绩总览
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-around",
                    height: 280,
                    padding: "0 20px",
                    gap: 16,
                  }}
                >
                  {deptStats
                    .sort(
                      (a, b) => b.totalContractAmount - a.totalContractAmount
                    )
                    .slice(0, 6)
                    .map((dept, idx) => {
                      const maxAmount = Math.max(
                        ...deptStats.map((d) => d.totalContractAmount),
                        1
                      );
                      const heightPercent =
                        (dept.totalContractAmount / maxAmount) * 100;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flex: 1,
                            maxWidth: 100,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: "#3B82F6",
                              marginBottom: 8,
                            }}
                          >
                            {(dept.totalContractAmount / 10000).toFixed(1)}万
                          </div>
                          <div
                            style={{
                              width: 50,
                              height: Math.max((heightPercent / 100) * 200, 20),
                              background:
                                "linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)",
                              borderRadius: "8px 8px 0 0",
                              transition: "height 1s ease",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                bottom: -40,
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontSize: 12,
                                color: "#64748B",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                                width: 80,
                                textAlign: "center",
                              }}
                            >
                              {dept.department}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* 部门业绩条形图 */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1D1D1F",
                    marginBottom: 24,
                  }}
                >
                  部门合同金额排名
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {deptStats
                    .sort(
                      (a, b) => b.totalContractAmount - a.totalContractAmount
                    )
                    .map((dept, index) => {
                      const percentage =
                        (dept.totalContractAmount / maxDeptAmount) * 100;
                      return (
                        <div key={index}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#1D1D1F",
                              }}
                            >
                              {dept.department}
                            </span>
                            <span style={{ fontSize: 14, color: "#64748B" }}>
                              ¥{dept.totalContractAmount.toLocaleString()} (
                              {dept.contractCount}份)
                            </span>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: 32,
                              background: "#E5E7EB",
                              borderRadius: 8,
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: "100%",
                                background: `linear-gradient(90deg, ${
                                  index === 0 ? "#3B82F6" : "#60A5FA"
                                } 0%, ${
                                  index === 0 ? "#2563EB" : "#3B82F6"
                                } 100%)`,
                                borderRadius: 8,
                                transition: "width 1s ease",
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: 12,
                              }}
                            >
                              <span
                                style={{
                                  color: "#FFFFFF",
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </TabPane>

        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <DollarOutlined />
              产品销售统计
            </span>
          }
          key="product"
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ padding: "24px 0" }}>
              {/* 概览卡片 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}
                  >
                    总销售量
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#3B82F6" }}
                  >
                    {productStats.reduce(
                      (sum, p) => sum + p.totalSalesQuantity,
                      0
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#34C759", marginTop: 4 }}>
                    件
                  </div>
                </Card>
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}
                  >
                    总销售额
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#3B82F6" }}
                  >
                    ¥
                    {(
                      productStats.reduce(
                        (sum, p) => sum + p.totalSalesAmount,
                        0
                      ) / 10000
                    ).toFixed(1)}
                  </div>
                  <div style={{ fontSize: 12, color: "#34C759", marginTop: 4 }}>
                    万元
                  </div>
                </Card>
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}
                  >
                    总毛利润
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#34C759" }}
                  >
                    ¥
                    {(
                      productStats.reduce((sum, p) => sum + p.grossProfit, 0) /
                      10000
                    ).toFixed(1)}
                  </div>
                  <div style={{ fontSize: 12, color: "#34C759", marginTop: 4 }}>
                    万元
                  </div>
                </Card>
              </div>

              {/* 产品销售竖向条形图总览 */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 32,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1D1D1F",
                    marginBottom: 24,
                  }}
                >
                  产品销售总览
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-around",
                    height: 280,
                    padding: "0 20px",
                    gap: 16,
                  }}
                >
                  {productStats
                    .sort((a, b) => b.totalSalesAmount - a.totalSalesAmount)
                    .slice(0, 6)
                    .map((product, idx) => {
                      const maxAmount = Math.max(
                        ...productStats.map((p) => p.totalSalesAmount),
                        1
                      );
                      const heightPercent =
                        (product.totalSalesAmount / maxAmount) * 100;
                      const profitMargin =
                        (product.grossProfit / product.totalSalesAmount) * 100;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flex: 1,
                            maxWidth: 100,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: profitMargin > 20 ? "#34C759" : "#3B82F6",
                              marginBottom: 8,
                            }}
                          >
                            {(product.totalSalesAmount / 10000).toFixed(1)}万
                          </div>
                          <div
                            style={{
                              width: 50,
                              height: Math.max((heightPercent / 100) * 200, 20),
                              background:
                                profitMargin > 20
                                  ? "linear-gradient(180deg, #34C759 0%, #10B981 100%)"
                                  : "linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)",
                              borderRadius: "8px 8px 0 0",
                              transition: "height 1s ease",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                bottom: -40,
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontSize: 11,
                                color: "#64748B",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                                width: 100,
                                textAlign: "center",
                              }}
                            >
                              {product.productName.length > 6
                                ? product.productName.substring(0, 6) + "..."
                                : product.productName}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* 产品销售额条形图 */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1D1D1F",
                    marginBottom: 24,
                  }}
                >
                  产品销售额排名
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {productStats
                    .sort((a, b) => b.totalSalesAmount - a.totalSalesAmount)
                    .map((product, index) => {
                      const percentage =
                        (product.totalSalesAmount / maxProductAmount) * 100;
                      const profitMargin =
                        (product.grossProfit / product.totalSalesAmount) * 100;
                      return (
                        <div key={index}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#1D1D1F",
                              }}
                            >
                              {product.productName}
                            </span>
                            <span style={{ fontSize: 14, color: "#64748B" }}>
                              ¥{product.totalSalesAmount.toLocaleString()} (
                              {product.totalSalesQuantity}件)
                            </span>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: 32,
                              background: "#E5E7EB",
                              borderRadius: 8,
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: "100%",
                                background: `linear-gradient(90deg, ${
                                  profitMargin > 20 ? "#34C759" : "#3B82F6"
                                } 0%, ${
                                  profitMargin > 20 ? "#10B981" : "#2563EB"
                                } 100%)`,
                                borderRadius: 8,
                                transition: "width 1s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingLeft: 12,
                                paddingRight: 12,
                              }}
                            >
                              <span
                                style={{
                                  color: "#FFFFFF",
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                {percentage.toFixed(1)}%
                              </span>
                              <span
                                style={{
                                  color: "#FFFFFF",
                                  fontSize: 11,
                                  opacity: 0.9,
                                }}
                              >
                                毛利率: {profitMargin.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </TabPane>

        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ClockCircleOutlined />
              项目任务进度
            </span>
          }
          key="project"
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ padding: "24px 0" }}>
              {/* 概览卡片 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}
                  >
                    总项目数
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#3B82F6" }}
                  >
                    {new Set(projectStats.map((p) => p.projectId)).size}
                  </div>
                  <div style={{ fontSize: 12, color: "#34C759", marginTop: 4 }}>
                    个
                  </div>
                </Card>
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}
                  >
                    总任务数
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#3B82F6" }}
                  >
                    {projectStats.length}
                  </div>
                  <div style={{ fontSize: 12, color: "#34C759", marginTop: 4 }}>
                    个
                  </div>
                </Card>
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}
                  >
                    平均完成率
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#34C759" }}
                  >
                    {projectStats.length > 0
                      ? (
                          projectStats.reduce(
                            (sum, p) => sum + (p.completionRate || 0),
                            0
                          ) / projectStats.length
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                  <div style={{ fontSize: 12, color: "#34C759", marginTop: 4 }}>
                    整体进度
                  </div>
                </Card>
              </div>

              {/* 项目任务进度条形图 */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 32,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1D1D1F",
                    marginBottom: 24,
                  }}
                >
                  项目任务状态总览
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-around",
                    height: 280,
                    padding: "0 40px",
                  }}
                >
                  {[
                    {
                      label: "已完成",
                      count: projectStats.filter(
                        (t) => t.taskStatus === "Completed"
                      ).length,
                      color: "#34C759",
                    },
                    {
                      label: "进行中",
                      count: projectStats.filter(
                        (t) => t.taskStatus === "In Progress"
                      ).length,
                      color: "#3B82F6",
                    },
                    {
                      label: "未开始",
                      count: projectStats.filter(
                        (t) =>
                          t.taskStatus !== "Completed" && t.taskStatus !== "In Progress"
                      ).length,
                      color: "#94A3B8",
                    },
                  ].map((item, idx) => {
                    const maxCount = Math.max(
                      projectStats.filter((t) => t.taskStatus === "Completed")
                        .length,
                      projectStats.filter((t) => t.taskStatus === "In Progress")
                        .length,
                      projectStats.filter(
                        (t) =>
                          t.taskStatus !== "Completed" && t.taskStatus !== "In Progress"
                      ).length,
                      1
                    );
                    const heightPercent = (item.count / maxCount) * 100;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: 120,
                          opacity: 0,
                          animation: `fadeInUp 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) ${
                            0.2 + idx * 0.15
                          }s forwards`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: item.color,
                            marginBottom: 8,
                          }}
                        >
                          {item.count}
                        </div>
                        <div
                          style={{
                            width: 60,
                            height: Math.max((heightPercent / 100) * 200, 20),
                            background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}CC 100%)`,
                            borderRadius: "8px 8px 0 0",
                            transition: "height 1s ease",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              bottom: -30,
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontSize: 13,
                              color: "#64748B",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 项目任务进度条形图 */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1D1D1F",
                    marginBottom: 24,
                  }}
                >
                  项目任务完成进度
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {projectStats
                    .filter((task) => task.completionRate != null)
                    .slice(0, 15)
                    .sort(
                      (a, b) =>
                        (b.completionRate || 0) - (a.completionRate || 0)
                    )
                    .map((task, index) => {
                      const chineseStatus = getChineseStatus(task.taskStatus);
                      const statusColor =
                        task.taskStatus === "Completed"
                          ? "#34C759"
                          : task.taskStatus === "In Progress"
                          ? "#3B82F6"
                          : "#94A3B8";
                      return (
                        <div key={index}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: "#1D1D1F",
                                }}
                              >
                                {task.projectName}
                              </span>
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#64748B",
                                  marginLeft: 8,
                                }}
                              >
                                / {task.taskName}
                              </span>
                            </div>
                            <span style={{ fontSize: 14, color: "#64748B" }}>
                              {task.taskAssignee} (
                              <span
                                style={{ color: statusColor, fontWeight: 500 }}
                              >
                                {chineseStatus}
                              </span>
                              )
                            </span>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: 32,
                              background: "#E5E7EB",
                              borderRadius: 8,
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: `${task.completionRate || 0}%`,
                                height: "100%",
                                background:
                                  "linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)",
                                borderRadius: 8,
                                transition: "width 1s ease",
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: 12,
                              }}
                            >
                              <span
                                style={{
                                  color: "#FFFFFF",
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                {(task.completionRate || 0).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          {/* 备注：以下字段已从后端视图中删除，暂时隐藏
                          <div
                            style={{
                              fontSize: 11,
                              color: "#94A3B8",
                              marginTop: 4,
                            }}
                          >
                            合同: {task.contractName} | 客户:{" "}
                            {task.customerName} | 预算: ¥
                            {task.budget.toLocaleString()}
                          </div>
                          */}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StatisticsPage;

<style jsx global>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>;
