"use client";

import { useRouter } from "next/navigation";
import {
  FileTextOutlined,
  TeamOutlined,
  ShoppingOutlined,
  ProjectOutlined,
  DollarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

export default function Home() {
  const router = useRouter();

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 10px 30px rgba(59, 130, 246, 0.1)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.05)";
  };

  return (
    <div
      className="animate-fade-in-up"
      style={{
        padding: "24px 32px",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: 16 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#1E293B",
            marginBottom: 8,
          }}
        >
          欢迎回来，管理员
        </h1>
        <p style={{ color: "#64748B", fontSize: 16 }}>
          这里是您的工作台，今日各项数据概览如下
        </p>
      </div>

      {/* Statistics Section - More Prominent */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
      >
        {[
          { label: "总合同数", value: "128", unit: "份", change: "+12%" },
          { label: "总金额", value: "¥2,450k", unit: "", change: "+5.2%" },
          { label: "本月新增客户", value: "12", unit: "位", change: "+8%" },
          { label: "进行中项目", value: "8", unit: "个", change: "0%" },
        ].map((stat, index) => (
          <div
            key={index}
            className="glass-effect"
            style={{
              padding: "24px",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 140,
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "#64748B", fontSize: 14 }}>
                {stat.label}
              </span>
              <span
                style={{
                  color: stat.change.startsWith("+") ? "#10B981" : "#64748B",
                  fontSize: 12,
                  background: stat.change.startsWith("+")
                    ? "#ECFDF5"
                    : "#F1F5F9",
                  padding: "2px 8px",
                  borderRadius: 12,
                }}
              >
                {stat.change}
              </span>
            </div>
            <div>
              <span style={{ fontSize: 36, fontWeight: 700, color: "#1E293B" }}>
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "#94A3B8",
                  marginLeft: 4,
                  fontWeight: 500,
                }}
              >
                {stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Navigation - Flexible Grid */}
      <div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#1E293B",
            marginBottom: 20,
          }}
        >
          快捷导航
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // Changed to 3 columns for better flexibility
            gap: 24,
            gridAutoRows: "180px", // Fixed height for consistency
          }}
        >
          {/* Contracts - Large Card */}
          <div
            className="glass-effect"
            style={{
              gridColumn: "span 1",
              borderRadius: 16,
              padding: 24,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onClick={() => router.push("/contracts")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                background: "rgba(59, 130, 246, 0.1)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3B82F6",
                fontSize: 24,
              }}
            >
              <FileTextOutlined />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1E293B" }}>
                合同管理
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748B",
                  marginTop: 4,
                  marginBottom: 16,
                }}
              >
                全周期合同生命周期管理
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#3B82F6",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                进入系统 <ArrowRightOutlined style={{ marginLeft: 8 }} />
              </div>
            </div>
          </div>

          {/* Clients */}
          <div
            className="glass-effect"
            style={{
              gridColumn: "span 1",
              borderRadius: 16,
              padding: 24,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onClick={() => router.push("/clients")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#F0FDF4", // Green tint
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10B981",
                fontSize: 24,
              }}
            >
              <TeamOutlined />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1E293B" }}>
                客户管理
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748B",
                  marginTop: 4,
                  marginBottom: 16,
                }}
              >
                客户信息与关系维护
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#3B82F6",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                查看列表 <ArrowRightOutlined style={{ marginLeft: 8 }} />
              </div>
            </div>
          </div>

          {/* Projects */}
          <div
            className="glass-effect"
            style={{
              gridColumn: "span 1",
              borderRadius: 16,
              padding: 24,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onClick={() => router.push("/projects")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#FFF7ED", // Orange tint
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F97316",
                fontSize: 24,
              }}
            >
              <ProjectOutlined />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1E293B" }}>
                项目管理
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748B",
                  marginTop: 4,
                  marginBottom: 16,
                }}
              >
                项目进度与预算追踪
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#3B82F6",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                管理项目 <ArrowRightOutlined style={{ marginLeft: 8 }} />
              </div>
            </div>
          </div>

          {/* Payments & Products (Smaller row or split) */}
          <div
            className="glass-effect"
            style={{
              borderRadius: 16,
              padding: 24,
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
            onClick={() => router.push("/payments")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#FEF2F2", // Red tint
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#EF4444",
                fontSize: 20,
              }}
            >
              <DollarOutlined />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E293B" }}>
                回款管理
              </h3>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                财务记录与分析
              </p>
            </div>
          </div>

          <div
            className="glass-effect"
            style={{
              borderRadius: 16,
              padding: 24,
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
            onClick={() => router.push("/products")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#F5F3FF", // Purple tint
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8B5CF6",
                fontSize: 20,
              }}
            >
              <ShoppingOutlined />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1E293B" }}>
                产品管理
              </h3>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                产品库维护
              </p>
            </div>
          </div>

          {/* Placeholder for future expansion */}
          <div
            style={{
              borderRadius: 16,
              border: "2px dashed #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94A3B8",
              fontSize: 14,
            }}
          >
            敬请期待
          </div>
        </div>
      </div>
    </div>
  );
}
