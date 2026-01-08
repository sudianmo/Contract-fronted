"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { message } from "antd";
import {
  FileTextOutlined,
  TeamOutlined,
  ShoppingOutlined,
  ProjectOutlined,
  DollarOutlined,
  ArrowRightOutlined,
  DatabaseOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import {
  getDepartmentPerformanceByYear,
  getProductSalesStats,
} from "@/services/statsService";
import type { DepartmentPerformance, ProductSalesStats } from "@/types";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deptStats, setDeptStats] = useState<DepartmentPerformance[]>([]);
  const [productStats, setProductStats] = useState<ProductSalesStats[]>([]);
  const [animatedValues, setAnimatedValues] = useState({
    contracts: 0,
    amount: 0,
    clients: 0,
    projects: 0,
  });

  // 加载统计数据
  useEffect(() => {
    const loadStats = async () => {
      try {
        // 获取部门业绩统计（2024年）
        const deptData = await getDepartmentPerformanceByYear(2024);
        setDeptStats(deptData);

        // 获取产品销售统计（Top5）
        const productData = await getProductSalesStats({
          pageNum: 1,
          pageSize: 5,
        });
        setProductStats(productData.records || []);

        // 计算汇总数据
        const totalContracts = deptData.reduce(
          (sum, dept) => sum + dept.contractCount,
          0
        );
        const totalAmount = deptData.reduce(
          (sum, dept) => sum + dept.totalContractAmount,
          0
        );

        // 启动数字滚动动画
        startAnimation({
          contracts: totalContracts,
          amount: Math.round(totalAmount / 10000), // 转换为万元
          clients: 12, // 暂时保留硬编码
          projects: 8, // 暂时保留硬编码
        });
      } catch (error) {
        message.error("加载统计数据失败");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // 数字滚动动画
  const startAnimation = (targets: typeof animatedValues) => {
    const duration = 1000; // 1秒
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // 先快后慢

      setAnimatedValues({
        contracts: Math.floor(targets.contracts * easeProgress),
        amount: Math.floor(targets.amount * easeProgress),
        clients: Math.floor(targets.clients * easeProgress),
        projects: Math.floor(targets.projects * easeProgress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues(targets);
      }
    }, interval);
  };

  return (
    <div
      style={{
        padding: "24px 48px",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* 左上角30%炭黑毛玻璃区 - 禁用 */}
      {/* 已替换为body的拼图纹理背景 */}

      {/* 右侧70%淡白毛玻璃区 - 禁用 */}
      {/* 已替换为body的拼图纹理背景 */}

      {/* 斜线分割装饰 - 禁用 */}
      {/* 已替换为body的拼图纹理背景 */}
      {/* Header Section - 壮观英文主视觉 */}
      <div
        style={{
          marginBottom: 24,
          marginTop: 32,
          opacity: 0,
          animation:
            "fadeInUp 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 900,
            fontFamily: "'Roboto Condensed', 'Inter', sans-serif",
            color: "#F2F2F7",
            margin: 0,
            lineHeight: 1.2,
            textShadow: "0 4px 8px rgba(242, 242, 247, 0.1)",
            letterSpacing: 1,
          }}
        >
          Welcome
        </h1>
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#6C2BD9",
            margin: "8px 0 0 0",
            letterSpacing: 0.5,
            textShadow: "0 0 8px rgba(108, 43, 217, 0.5)",
          }}
        >
          Admin
        </div>
        <p
          style={{
            color: "#86868B",
            fontSize: 14,
            lineHeight: 1.5,
            margin: "12px 0 0 0",
            fontWeight: 400,
          }}
        >
          这里是您的工作台，今日各项数据概览如下
        </p>
      </div>

      {/* Statistics Section - Apple Style */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          position: "relative",
          zIndex: 2,
        }}
      >
        {[
          {
            label: "总合同数",
            value: animatedValues.contracts,
            unit: "份",
            change: "+12%",
          },
          {
            label: "总金额",
            value: `¥${animatedValues.amount}`,
            unit: "万",
            change: "+5.2%",
          },
          {
            label: "本月新增客户",
            value: animatedValues.clients,
            unit: "位",
            change: "+8%",
          },
          {
            label: "进行中项目",
            value: animatedValues.projects,
            unit: "个",
            change: "0%",
          },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              background: "rgba(30, 30, 35, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(242, 242, 247, 0.2)",
              padding: "20px 24px",
              borderRadius: 18,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 88,
              transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
              opacity: 0,
              animation: `fadeInUp 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0) ${
                0.1 + index * 0.1
              }s forwards`,
              animationName: "fadeInUp, breatheShadow",
              animationDuration: "0.5s, 3s",
              animationDelay: `${0.1 + index * 0.1}s, ${0.6 + index * 0.1}s`,
              animationIterationCount: "1, infinite",
              animationTimingFunction:
                "cubic-bezier(0.25, 0.1, 0.25, 1.0), ease-in-out",
              transform: "translateY(1px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(0, 0, 0, 0.3)";
              e.currentTarget.style.background = "rgba(30, 30, 35, 0.85)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(1px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.background = "rgba(30, 30, 35, 0.7)";
            }}
          >
            {/* XAUT水印 */}
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                fontSize: 20,
                fontWeight: 300,
                color: "rgba(108, 43, 217, 0.15)",
                letterSpacing: 1,
                textShadow: "0 0 4px rgba(108, 43, 217, 0.3)",
              }}
            >
              XAUT
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "#86868B", fontSize: 12, fontWeight: 400 }}>
                {stat.label}
              </span>
              <span
                style={{
                  color: stat.change.startsWith("+") ? "#34C759" : "#86868B",
                  fontSize: 12,
                  fontWeight: 500,
                  background: stat.change.startsWith("+")
                    ? "rgba(52, 199, 89, 0.15)"
                    : "transparent",
                  padding: stat.change.startsWith("+") ? "2px 6px" : "0",
                  borderRadius: 4,
                  textShadow: stat.change.startsWith("+")
                    ? "0 0 4px rgba(52, 199, 89, 0.3)"
                    : "none",
                }}
              >
                {stat.change}
              </span>
            </div>
            <div>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#F2F2F7" }}>
                {stat.value}
              </span>
              {stat.unit && (
                <span
                  style={{
                    fontSize: 14,
                    color: "#86868B",
                    marginLeft: 4,
                    fontWeight: 400,
                  }}
                >
                  {stat.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Navigation - Apple Minimalist Style */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#F2F2F7",
            marginBottom: 16,
            lineHeight: 1.5,
            opacity: 0,
            animation:
              "fadeInUp 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0) 0.5s forwards",
          }}
        >
          快捷导航
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {[
            {
              icon: <FileTextOutlined />,
              title: "合同管理",
              desc: "全周期合同生命周期管理",
              action: "进入系统",
              path: "/contracts",
            },
            {
              icon: <BarChartOutlined />,
              title: "数据统计",
              desc: "部门业绩与产品销售分析",
              action: "查看报表",
              path: "/statistics",
            },
            {
              icon: <TeamOutlined />,
              title: "客户管理",
              desc: "客户信息与关系维护",
              action: "查看列表",
              path: "/clients",
            },
            {
              icon: <ProjectOutlined />,
              title: "项目管理",
              desc: "项目进度与预算追踪",
              action: "管理项目",
              path: "/projects",
            },
            {
              icon: <DollarOutlined />,
              title: "回款管理",
              desc: "财务记录与分析",
              action: "查看详情",
              path: "/payments",
            },
            {
              icon: <ShoppingOutlined />,
              title: "产品管理",
              desc: "产品库维护",
              action: "管理产品",
              path: "/products",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(229, 231, 235, 0.6)",
                borderRadius: 16,
                padding: "20px 24px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.03)",
                height: 120,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: 0,
                animation: `fadeInUp 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0) ${
                  0.6 + index * 0.1
                }s forwards`,
                transform: "translateY(1px)",
              }}
              onClick={(e) => {
                e.currentTarget.style.transform = "translateY(3px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 12px rgba(0, 0, 0, 0.04)";
                setTimeout(() => {
                  router.push(item.path);
                }, 200);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.background = "rgba(240, 242, 245, 0.9)";
                e.currentTarget.style.boxShadow =
                  "0 6px 12px rgba(0, 0, 0, 0.04)";
                const icon = e.currentTarget.querySelector(
                  ".nav-icon"
                ) as HTMLElement;
                if (icon) {
                  icon.style.animation = "iconRotate 0.5s ease-in-out";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(1px)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.03)";
                const icon = e.currentTarget.querySelector(
                  ".nav-icon"
                ) as HTMLElement;
                if (icon) {
                  icon.style.animation = "";
                }
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <div
                  className="nav-icon"
                  style={{
                    fontSize: 24,
                    color: "#5E5E62",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#1D1D1F",
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#757575",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#6C2BD9",
                  fontSize: 12,
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#5A23B0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#6C2BD9";
                }}
              >
                {item.action}{" "}
                <ArrowRightOutlined style={{ marginLeft: 4, fontSize: 12 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
