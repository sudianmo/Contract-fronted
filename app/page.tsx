"use client";

import { Button, Card, Space } from "antd";
import { useRouter } from "next/navigation";
import { FileTextOutlined, TeamOutlined } from "@ant-design/icons";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        padding: 48,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: 1000, width: "100%" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: 48,
            color: "white",
            fontSize: 48,
            fontWeight: "bold",
          }}
        >
          合同管理系统
        </h1>

        <Space
          direction="horizontal"
          size={32}
          style={{ width: "100%", justifyContent: "center" }}
        >
          <Card
            hoverable
            style={{ width: 350, textAlign: "center" }}
            onClick={() => router.push("/contracts")}
          >
            <FileTextOutlined
              style={{ fontSize: 64, color: "#1890ff", marginBottom: 24 }}
            />
            <h2 style={{ marginBottom: 16 }}>合同管理</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              创建、查看、编辑和管理所有合同信息
            </p>
            <Button type="primary" size="large" block>
              进入管理
            </Button>
          </Card>

          <Card
            hoverable
            style={{ width: 350, textAlign: "center" }}
            onClick={() => router.push("/clients")}
          >
            <TeamOutlined
              style={{ fontSize: 64, color: "#52c41a", marginBottom: 24 }}
            />
            <h2 style={{ marginBottom: 16 }}>客户管理</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              维护客户信息，管理客户关系
            </p>
            <Button
              type="primary"
              size="large"
              block
              style={{ backgroundColor: "#52c41a" }}
            >
              进入管理
            </Button>
          </Card>
        </Space>

        <div
          style={{
            marginTop: 48,
            textAlign: "center",
            color: "white",
            fontSize: 14,
          }}
        >
          <p>简约设计 · 高效管理</p>
        </div>
      </div>
    </div>
  );
}
