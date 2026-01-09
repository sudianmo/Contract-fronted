"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Modal, Input, message } from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  TeamOutlined,
  ShoppingOutlined,
  ProjectOutlined,
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  InboxOutlined,
  AlertOutlined,
  DeleteOutlined,
  LogoutOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // 检查管理员解锁状态
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdminUnlocked(!!token);
  }, [pathname]);

  // 仪表盘数据
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    monthlyNewProducts: 0,
    targetProgress: 0,
  });

  const [animatedData, setAnimatedData] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    monthlyNewProducts: 0,
    targetProgress: 0,
  });

  const menuItems = [
    { key: "/", label: "首页", icon: <HomeOutlined /> },
    { key: "/contracts", label: "合同管理", icon: <FileTextOutlined /> },
    { key: "/clients", label: "客户管理", icon: <TeamOutlined /> },
    { key: "/projects", label: "项目管理", icon: <ProjectOutlined /> },
    { key: "/products", label: "产品管理", icon: <ShoppingOutlined /> },
    { key: "/payments", label: "回款管理", icon: <DollarOutlined /> },
  ];

  // 处理回收站点击
  const handleRecycleClick = () => {
    setPasswordModalVisible(true);
    setAdminPassword("");
  };

  // 验证管理员密码
  const handlePasswordSubmit = () => {
    // 管理员密码：12345678
    if (adminPassword === "12345678") {
      setPasswordModalVisible(false);
      setAdminPassword("");
      // 设置管理员token
      localStorage.setItem("adminToken", "admin-authenticated");
      localStorage.setItem("adminUsername", "admin");
      setIsAdminUnlocked(true); // 更新解锁状态
      router.push("/admin/recycle");
    } else {
      message.error("密码错误，请重试");
      setAdminPassword("");
    }
  };

  // 退出登录
  const handleLogout = () => {
    // 清除所有登录信息
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    setIsAdminUnlocked(false); // 更新解锁状态
    message.success("已退出登录");
    router.push("/login");
  };

  // 模拟数据加载
  useEffect(() => {
    setTimeout(() => {
      setDashboardData({
        totalProducts: 9,
        lowStockCount: 2,
        monthlyNewProducts: 3,
        targetProgress: 60,
      });
    }, 500);
  }, []);

  // 数字滚动动画
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedData({
        totalProducts: Math.floor(dashboardData.totalProducts * easeProgress),
        lowStockCount: Math.floor(dashboardData.lowStockCount * easeProgress),
        monthlyNewProducts: Math.floor(
          dashboardData.monthlyNewProducts * easeProgress
        ),
        targetProgress: Math.floor(dashboardData.targetProgress * easeProgress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedData(dashboardData);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [dashboardData]);

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      style={{
        opacity: 0,
        animation:
          "sidebarSlideIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
      }}
    >
      {/* XAUT品牌标识 - 紫色简洁版 */}
      {!collapsed && (
        <div
          style={{
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            height: "40px",
            opacity: 0,
            animation:
              "logoReveal 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0) 0.2s forwards",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              color: "#6C2BD9",
              letterSpacing: 2,
              textShadow: "0 0 8px rgba(108, 43, 217, 0.5)",
            }}
          >
            XAUT
          </div>
        </div>
      )}

      <div
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          marginBottom: 10,
          color: "#F2F2F7",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 菜单项 */}
        <div>
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.key}
              className={`menu-item ${pathname === item.key ? "active" : ""}`}
              title={collapsed ? item.label : ""}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="label">{item.label}</span>}
            </Link>
          ))}

          {/* 管理员页面入口 */}
          <div
            className={`menu-item ${pathname === "/admin/recycle" ? "active" : ""}`}
            onClick={handleRecycleClick}
            title={collapsed ? "管理员页面" : ""}
            style={{
              cursor: "pointer",
              borderTop: "1px solid rgba(242, 242, 247, 0.1)",
              marginTop: 8,
            }}
          >
            <span className="icon">
              {isAdminUnlocked ? (
                <UnlockOutlined style={{ color: "#34C759" }} />
              ) : (
                <LockOutlined style={{ color: "#FF3B30" }} />
              )}
            </span>
            {!collapsed && <span className="label">管理员页面</span>}
          </div>
        </div>

        {/* 仪表盘插件区域 */}
        {!collapsed && (
          <div style={{ marginTop: 24, padding: "0 12px" }}>
            {/* 插件1: 产品库存概览 */}
            <div
              className="dashboard-widget"
              onClick={() => router.push("/products")}
              style={{
                background: "rgba(30, 30, 35, 0.5)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(242, 242, 247, 0.15)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease",
                opacity: 0,
                animation:
                  "widgetFadeIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0) 0.3s forwards",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(30, 30, 35, 0.7)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(30, 30, 35, 0.5)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <InboxOutlined
                  style={{ fontSize: 16, color: "#F2F2F7", marginRight: 6 }}
                />
                <span
                  style={{ fontSize: 12, fontWeight: 500, color: "#F2F2F7" }}
                >
                  产品库存概览
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 20, fontWeight: 700, color: "#F2F2F7" }}
                  >
                    {animatedData.totalProducts}
                  </div>
                  <div style={{ fontSize: 12, color: "#86868B", marginTop: 2 }}>
                    总产品数
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#FF3B30",
                      textShadow: "0 0 6px rgba(255, 59, 48, 0.4)",
                    }}
                  >
                    {animatedData.lowStockCount}
                  </div>
                  <div style={{ fontSize: 12, color: "#86868B", marginTop: 2 }}>
                    库存预警
                  </div>
                </div>
              </div>
            </div>

            {/* 插件2: 本月新增统计 */}
            <div
              className="dashboard-widget"
              onClick={() => router.push("/products")}
              style={{
                background: "rgba(30, 30, 35, 0.5)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(242, 242, 247, 0.15)",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease",
                opacity: 0,
                animation:
                  "widgetFadeIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0) 0.4s forwards",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(30, 30, 35, 0.7)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(30, 30, 35, 0.5)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <AlertOutlined
                  style={{ fontSize: 16, color: "#F2F2F7", marginRight: 6 }}
                />
                <span
                  style={{ fontSize: 12, fontWeight: 500, color: "#F2F2F7" }}
                >
                  本月新增统计
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 20, fontWeight: 700, color: "#F2F2F7" }}
                  >
                    {animatedData.monthlyNewProducts}
                  </div>
                  <div style={{ fontSize: 12, color: "#86868B", marginTop: 2 }}>
                    新增产品
                  </div>
                </div>
                {/* 环形进度条 */}
                <div style={{ position: "relative", width: 40, height: 40 }}>
                  <svg
                    width="40"
                    height="40"
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    {/* 底色环 */}
                    <circle
                      cx="20"
                      cy="20"
                      r="17"
                      fill="none"
                      stroke="rgba(242, 242, 247, 0.2)"
                      strokeWidth="3"
                    />
                    {/* 进度环 */}
                    <circle
                      cx="20"
                      cy="20"
                      r="17"
                      fill="none"
                      stroke="#6C2BD9"
                      strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 17}`}
                      strokeDashoffset={`${
                        2 *
                        Math.PI *
                        17 *
                        (1 - animatedData.targetProgress / 100)
                      }`}
                      strokeLinecap="round"
                      style={{
                        transition: "stroke-dashoffset 1.2s linear",
                        filter: "drop-shadow(0 0 4px rgba(108, 43, 217, 0.5))",
                      }}
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#6C2BD9",
                      textShadow: "0 0 4px rgba(108, 43, 217, 0.5)",
                    }}
                  >
                    {animatedData.targetProgress}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部用户模块 */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <UserOutlined />
        </div>
        {!collapsed && (
          <div className="user-info">
            <div className="user-name">管理员</div>
          </div>
        )}
        {/* 退出登录按钮 */}
        <div
          className="logout-btn"
          onClick={handleLogout}
          title="退出登录"
          style={{
            marginLeft: collapsed ? 0 : "auto",
            cursor: "pointer",
            padding: "8px",
            borderRadius: 6,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 59, 48, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogoutOutlined
            style={{
              fontSize: 18,
              color: "#FF3B30",
            }}
          />
        </div>
      </div>

      {/* 管理员密码验证模态框 */}
      <Modal
        title="管理员验证"
        open={passwordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          setPasswordModalVisible(false);
          setAdminPassword("");
        }}
        okText="确认"
        cancelText="取消"
        centered
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "#64748B", marginBottom: 12 }}>
            访问管理员页面需要管理员权限，请输入管理员密码：
          </p>
          <Input.Password
            placeholder="请输入管理员密码"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onPressEnter={handlePasswordSubmit}
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
