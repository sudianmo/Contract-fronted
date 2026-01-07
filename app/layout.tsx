import type { Metadata } from "next";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import ConnectionStatus from "@/components/ConnectionStatus";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "合同管理系统",
  description: "合同和客户管理系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Roboto+Condensed:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorPrimary: "#4A90E2",
              colorBgLayout: "#FFFFFF",
              borderRadius: 8,
              colorText: "#1E293B",
              colorTextSecondary: "#64748B",
            },
            components: {
              Table: {
                headerBg: "#F1F5F9",
                headerColor: "#1E293B",
                rowHoverBg: "#F8FAFC",
              },
              Button: {
                borderRadius: 8,
              },
            },
          }}
        >
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">{children}</div>
          </div>
          <ConnectionStatus />
        </ConfigProvider>
      </body>
    </html>
  );
}
