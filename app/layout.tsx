import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import ConnectionStatus from "@/components/ConnectionStatus";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorPrimary: "#3B82F6",
              colorBgLayout: "#F8FAFC",
              borderRadius: 8,
              colorText: "#1E293B",
              colorTextSecondary: "#64748B",
            },
            components: {
              Table: {
                headerBg: "#F1F5F9",
                headerColor: "#1E293B",
                rowHoverBg: "#EFF6FF",
              },
              Button: {
                borderRadius: 8,
              },
            },
          }}
        >
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">
              {children}
            </div>
          </div>
          <ConnectionStatus />
        </ConfigProvider>
      </body>
    </html>
  );
}
