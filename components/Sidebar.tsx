"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  FileTextOutlined,
  TeamOutlined,
  ShoppingOutlined,
  ProjectOutlined,
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: "/", label: "首页", icon: <HomeOutlined /> },
    { key: "/contracts", label: "合同管理", icon: <FileTextOutlined /> },
    { key: "/clients", label: "客户管理", icon: <TeamOutlined /> },
    { key: "/projects", label: "项目管理", icon: <ProjectOutlined /> },
    { key: "/products", label: "产品管理", icon: <ShoppingOutlined /> },
    { key: "/payments", label: "回款管理", icon: <DollarOutlined /> },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          marginBottom: 10,
          color: "#64748B",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
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
    </div>
  );
};

export default Sidebar;
