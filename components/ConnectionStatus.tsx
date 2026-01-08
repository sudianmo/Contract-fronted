"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const checkConnection = async () => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      await axios.get(`${baseUrl}/api/clients?pageNum=1&pageSize=1`, {
        timeout: 3000,
      });
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px 20px",
        borderRadius: "8px",
        backgroundColor:
          isConnected === null ? "#fff" : isConnected ? "#52c41a" : "#ff4d4f",
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
      }}
      onClick={() => setIsVisible(false)}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "white",
          animation: isConnected === null ? "pulse 1.5s infinite" : "none",
        }}
      />
      {isConnected === null
        ? "检测中..."
        : isConnected
        ? "后端已连接"
        : "后端未连接"}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
