"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, message, Tabs, Popconfirm, Tag, Space } from "antd";
import {
  DeleteOutlined,
  RollbackOutlined,
  TeamOutlined,
  ShoppingOutlined,
  ProjectOutlined,
  FileTextOutlined,
  DollarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

// 封装带Token的请求
const adminRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    message.error("未登录，请先登录");
    window.location.href = "/admin/login";
    throw new Error("未授权");
  }

  const response = await fetch(`http://localhost:8080${url}`, {
    ...options,
    headers: {
      ...options.headers,
      "Admin-Token": token,
    },
  });

  if (response.status === 401 || response.status === 403) {
    message.error("登录已过期，请重新登录");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    window.location.href = "/admin/login";
    throw new Error("未授权");
  }

  return response.json();
};

export default function RecycleBin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("clients");

  // 各模块的已删除数据
  const [deletedClients, setDeletedClients] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [deletedProjects, setDeletedProjects] = useState([]);
  const [deletedContracts, setDeletedContracts] = useState([]);
  const [deletedPayments, setDeletedPayments] = useState([]);

  // 统计信息
  const [stats, setStats] = useState({
    clientCount: 0,
    productCount: 0,
    projectCount: 0,
    contractCount: 0,
    paymentCount: 0,
  });

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      message.warning("请先登录");
      router.push("/admin/login");
    } else {
      loadStats();
      loadAllDeletedData();
    }
  }, []);

  // 加载统计信息
  const loadStats = async () => {
    try {
      const data = await adminRequest("/api/admin/deleted/stats");
      if (data.code === 200) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  // 加载所有已删除数据
  const loadAllDeletedData = async () => {
    setLoading(true);
    try {
      const [clients, products, projects, contracts, payments] =
        await Promise.all([
          adminRequest("/api/admin/clients/deleted"),
          adminRequest("/api/admin/products/deleted"),
          adminRequest("/api/admin/projects/deleted"),
          adminRequest("/api/admin/contracts/deleted"),
          adminRequest("/api/admin/payments/deleted"),
        ]);

      if (clients.code === 200) setDeletedClients(clients.data);
      if (products.code === 200) setDeletedProducts(products.data);
      if (projects.code === 200) setDeletedProjects(projects.data);
      if (contracts.code === 200) setDeletedContracts(contracts.data);
      if (payments.code === 200) setDeletedPayments(payments.data);
    } catch (error) {
      console.error("Failed to load deleted data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 恢复数据
  const handleRestore = async (type: string, id: number) => {
    try {
      const data = await adminRequest(`/api/admin/${type}/restore/${id}`, {
        method: "PUT",
      });

      if (data.code === 200) {
        message.success("恢复成功");
        loadAllDeletedData();
        loadStats();
      } else {
        message.error(data.message || "恢复失败");
      }
    } catch (error) {
      console.error("Restore error:", error);
      message.error("恢复失败");
    }
  };

  // 永久删除
  const handlePermanentDelete = async (type: string, id: number) => {
    try {
      const data = await adminRequest(`/api/admin/${type}/permanent/${id}`, {
        method: "DELETE",
      });

      if (data.code === 200) {
        message.success("永久删除成功");
        loadAllDeletedData();
        loadStats();
      } else {
        message.error(data.message || "删除失败");
      }
    } catch (error) {
      console.error("Delete error:", error);
      message.error("删除失败");
    }
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    message.success("已退出登录");
    router.push("/");
  };

  // 客户表格列
  const clientColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "客户名称", dataIndex: "customerName", key: "customerName" },
    { title: "联系人", dataIndex: "contactPerson", key: "contactPerson" },
    { title: "联系电话", dataIndex: "contactPhone", key: "contactPhone" },
    { title: "邮箱", dataIndex: "email", key: "email" },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<RollbackOutlined />}
            onClick={() => handleRestore("clients", record.id)}
          >
            恢复
          </Button>
          <Popconfirm
            title="永久删除"
            description="此操作不可逆，确定要永久删除吗？"
            onConfirm={() => handlePermanentDelete("clients", record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              永久删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 产品表格列
  const productColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "产品名称", dataIndex: "productName", key: "productName" },
    { title: "分类", dataIndex: "category", key: "category" },
    { title: "价格", dataIndex: "price", key: "price" },
    { title: "库存", dataIndex: "stock", key: "stock" },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<RollbackOutlined />}
            onClick={() => handleRestore("products", record.id)}
          >
            恢复
          </Button>
          <Popconfirm
            title="永久删除"
            description="此操作不可逆，确定要永久删除吗？"
            onConfirm={() => handlePermanentDelete("products", record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              永久删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 项目表格列
  const projectColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "项目名称", dataIndex: "projectName", key: "projectName" },
    { title: "客户ID", dataIndex: "customerId", key: "customerId" },
    { title: "预算", dataIndex: "budget", key: "budget" },
    { title: "状态", dataIndex: "status", key: "status" },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<RollbackOutlined />}
            onClick={() => handleRestore("projects", record.id)}
          >
            恢复
          </Button>
          <Popconfirm
            title="永久删除"
            description="此操作不可逆，确定要永久删除吗？"
            onConfirm={() => handlePermanentDelete("projects", record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              永久删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 合同表格列
  const contractColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "合同编号", dataIndex: "contractNumber", key: "contractNumber" },
    { title: "合同名称", dataIndex: "contractName", key: "contractName" },
    { title: "客户ID", dataIndex: "customerId", key: "customerId" },
    { title: "合同金额", dataIndex: "contractAmount", key: "contractAmount" },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<RollbackOutlined />}
            onClick={() => handleRestore("contracts", record.id)}
          >
            恢复
          </Button>
          <Popconfirm
            title="永久删除"
            description="此操作不可逆，确定要永久删除吗？"
            onConfirm={() => handlePermanentDelete("contracts", record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              永久删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 支付表格列
  const paymentColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "合同ID", dataIndex: "contractId", key: "contractId" },
    { title: "支付金额", dataIndex: "paymentAmount", key: "paymentAmount" },
    { title: "支付日期", dataIndex: "paymentDate", key: "paymentDate" },
    { title: "支付方式", dataIndex: "paymentMethod", key: "paymentMethod" },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<RollbackOutlined />}
            onClick={() => handleRestore("payments", record.id)}
          >
            恢复
          </Button>
          <Popconfirm
            title="永久删除"
            description="此操作不可逆，确定要永久删除吗？"
            onConfirm={() => handlePermanentDelete("payments", record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              永久删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "clients",
      label: (
        <span>
          <TeamOutlined /> 客户 <Tag color="blue">{stats.clientCount}</Tag>
        </span>
      ),
      children: (
        <Table
          columns={clientColumns}
          dataSource={deletedClients}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: "products",
      label: (
        <span>
          <ShoppingOutlined /> 产品{" "}
          <Tag color="purple">{stats.productCount}</Tag>
        </span>
      ),
      children: (
        <Table
          columns={productColumns}
          dataSource={deletedProducts}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: "projects",
      label: (
        <span>
          <ProjectOutlined /> 项目{" "}
          <Tag color="orange">{stats.projectCount}</Tag>
        </span>
      ),
      children: (
        <Table
          columns={projectColumns}
          dataSource={deletedProjects}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: "contracts",
      label: (
        <span>
          <FileTextOutlined /> 合同{" "}
          <Tag color="green">{stats.contractCount}</Tag>
        </span>
      ),
      children: (
        <Table
          columns={contractColumns}
          dataSource={deletedContracts}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: "payments",
      label: (
        <span>
          <DollarOutlined /> 支付 <Tag color="red">{stats.paymentCount}</Tag>
        </span>
      ),
      children: (
        <Table
          columns={paymentColumns}
          dataSource={deletedPayments}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "24px 32px",
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#1E293B",
              margin: 0,
            }}
          >
            数据回收站
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: "8px 0 0 0" }}>
            管理员：{localStorage.getItem("adminUsername") || "admin"} |
            权限：完全控制
          </p>
        </div>
        <Space>
          <Button onClick={() => router.push("/")}>返回首页</Button>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>
            退出登录
          </Button>
        </Space>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={items}
          size="large"
        />
      </div>
    </div>
  );
}
