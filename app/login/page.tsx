"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { login } from "@/services/authService";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      message.warning("请输入用户名和密码");
      return;
    }

    setLoading(true);
    try {
      const user = await login({ username, password });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("username", username); // 保存用户名
      message.success("登录成功");
      router.push("/");
    } catch (error: any) {
      message.error(error?.message || "登录失败");
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
        justifyContent: "space-between",
        padding: "0 5%",
        background:
          "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/building-bg.jpg') center/cover no-repeat",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* 左侧文字 */}
      <div
        style={{
          color: "#fff",
          fontSize: "5vw",
          fontWeight: 900,
          fontStyle: "italic",
          textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
          lineHeight: 1.3,
          letterSpacing: "-0.02em",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            marginLeft: 0,
            opacity: 0,
            animation:
              "slideInLeft 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) 0.3s forwards",
          }}
        >
          Make Contract
        </div>
        <div
          style={{
            marginLeft: "6vw",
            marginTop: 8,
            opacity: 0,
            animation:
              "slideInRight 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) 0.6s forwards",
          }}
        >
          Management Efficient
        </div>
      </div>

      {/* 右侧登录框 */}
      <div
        style={{
          width: 420,
          padding: 50,
          borderRadius: 24,
          background: "rgba(20, 20, 20, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          transition: "transform 0.3s ease",
          opacity: 0,
          animation:
            "fadeInUp 1s cubic-bezier(0.25, 0.1, 0.25, 1) 0.9s forwards",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* XAUT Logo */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            fontStyle: "italic",
            color: "#6C2BD9",
            textAlign: "center",
            marginBottom: 40,
            textShadow: "0 2px 4px rgba(108, 43, 217, 0.3)",
          }}
        >
          XAUT
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              height: 50,
              marginBottom: 20,
              padding: "0 16px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 10,
              background: "rgba(255, 255, 255, 0.08)",
              color: "#fff",
              fontSize: 15,
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.borderColor = "rgba(108, 43, 217, 0.5)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          />

          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              height: 50,
              marginBottom: 28,
              padding: "0 16px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 10,
              background: "rgba(255, 255, 255, 0.08)",
              color: "#fff",
              fontSize: 15,
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.borderColor = "rgba(108, 43, 217, 0.5)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 52,
              border: "none",
              borderRadius: 10,
              background: "#000",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#1a1a1a";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#000";
            }}
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>

      <style jsx global>{`
        ::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
