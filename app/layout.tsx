"use client";

import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import ConnectionStatus from "@/components/ConnectionStatus";
import Sidebar from "@/components/Sidebar";
import { checkAuth } from "@/services/authService";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // 路由守卫：检查登录状态
  useEffect(() => {
    const whiteList = ["/login", "/admin/login"];
    if (!whiteList.includes(pathname)) {
      const user = checkAuth();
      if (!user) {
        router.replace("/login");
      }
    }
  }, [pathname, router]);

  // 登录页不显示Sidebar
  const isLoginPage = pathname === "/login" || pathname === "/admin/login";

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
          {isLoginPage ? (
            <div>{children}</div>
          ) : (
            <div className="app-layout">
              <Sidebar />
              <div className="main-content">{children}</div>
            </div>
          )}
          <ConnectionStatus />
        </ConfigProvider>
      </body>
    </html>
  );
}
