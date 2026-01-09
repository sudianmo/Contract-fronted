"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      if (values.username !== "admin") {
        message.error("用户名不存在");
        return;
      }

      if (values.password !== "admin123") {
        message.error("密码错误");
        return;
      }

      localStorage.setItem("adminUsername", "admin");
      message.success("登录成功！");

      setTimeout(() => {
        router.push("/admin/recycle");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      message.error("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F8F9FC 0%, #EEF1F8 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 450,
          background: "#fff",
          borderRadius: 8,
          padding: "48px 40px",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 20px",
              background: "#4A90E2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 40,
              boxShadow: "0 4px 12px rgba(74, 144, 226, 0.2)",
            }}
          >
            <DatabaseOutlined />
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1E293B",
              margin: 0,
              marginBottom: 8,
            }}
          >
            数据库管理员
          </h1>
          <p style={{ color: "#64748B", fontSize: 16, margin: 0 }}>
            请登录以访问回收站管理
          </p>
        </div>

        {/* Login Form */}
        <Form
          name="admin_login"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#94A3B8" }} />}
              placeholder="用户名"
              style={{
                borderRadius: 12,
                padding: "12px 16px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#94A3B8" }} />}
              placeholder="密码"
              style={{
                borderRadius: 12,
                padding: "12px 16px",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                background: "linear-gradient(135deg, #E1E6F0 0%, #CED8E8 100%)",
                border: "none",
                color: "#1E293B",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
              }}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Button
              type="link"
              onClick={() => router.push("/")}
              style={{ color: "#64748B" }}
            >
              返回首页
            </Button>
          </div>
        </Form>

        {/* Hint */}
        <div
          style={{
            marginTop: 32,
            padding: 16,
            background: "#F8FAFC",
            borderRadius: 12,
            border: "1px solid #E2E8F0",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#64748B",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "#1E293B" }}>默认账号：</strong>
            <br />
            用户名：admin
            <br />
            密码：admin123
          </p>
        </div>
      </div>
    </div>
  );
}
