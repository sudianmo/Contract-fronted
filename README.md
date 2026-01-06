# 合同管理系统前端

一个基于 Next.js + React + Ant Design 的合同管理系统前端项目。

## 📦 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 库**: Ant Design 5.x
- **语言**: TypeScript
- **HTTP 客户端**: Axios
- **日期处理**: Day.js

## 🚀 快速开始

### 前置要求

- Node.js 18+ （推荐使用最新的 LTS 版本）
- npm 或 yarn 或 pnpm

### 步骤 1: 安装依赖

打开命令行（PowerShell 或 CMD），进入项目目录：

```bash
cd c:\Users\DamSu\Desktop\code\contract_fronted
```

安装项目依赖：

```bash
npm install
```

或使用 yarn：

```bash
yarn install
```

或使用 pnpm：

```bash
pnpm install
```

### 步骤 2: 配置后端地址

项目已经创建了 `.env.local` 文件，默认后端地址是 `http://localhost:8080`。

如果你的 Spring Boot 后端地址不同，请修改 `.env.local` 文件：

```env
# 修改为你的后端地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:你的端口号
```

### 步骤 3: 启动开发服务器

```bash
npm run dev
```

或使用 yarn：

```bash
yarn dev
```

或使用 pnpm：

```bash
pnpm dev
```

### 步骤 4: 访问应用

在浏览器中打开：

```
http://localhost:3000
```

## 📁 项目结构

```
contract_fronted/
├── app/                      # Next.js 应用目录
│   ├── page.tsx             # 首页（导航页）
│   ├── layout.tsx           # 根布局
│   ├── globals.css          # 全局样式
│   ├── contracts/           # 合同管理页面
│   │   └── page.tsx
│   └── clients/             # 客户管理页面
│       └── page.tsx
├── components/              # 组件目录
│   ├── ContractList.tsx    # 合同列表组件
│   └── ClientList.tsx      # 客户列表组件
├── services/                # API 服务层
│   ├── contractService.ts  # 合同相关API
│   └── clientService.ts    # 客户相关API
├── types/                   # TypeScript 类型定义
│   └── index.ts
├── utils/                   # 工具函数
│   └── request.ts          # Axios 请求封装
├── .env.local              # 环境变量配置
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
└── next.config.js          # Next.js 配置
```

## 🎯 功能特性

### 1. 合同管理 (`/contracts`)

- ✅ 合同列表展示（分页）
- ✅ 搜索合同（关键字搜索）
- ✅ 筛选合同（按状态、客户筛选）
- ✅ 新增合同
- ✅ 编辑合同
- ✅ 删除合同
- ✅ 表单验证

### 2. 客户管理 (`/clients`)

- ✅ 客户列表展示（分页）
- ✅ 搜索客户（关键字搜索）
- ✅ 新增客户
- ✅ 编辑客户
- ✅ 删除客户
- ✅ 表单验证（手机号、邮箱格式验证）

### 3. 首页导航 (`/`)

- ✅ 简约美观的导航界面
- ✅ 快速进入合同管理或客户管理

## 🔌 API 接口说明

### 后端接口规范

前端对接的是 RESTful 风格的后端接口，后端需要返回以下格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

### 合同接口

| 方法   | 路径                  | 说明                 |
| ------ | --------------------- | -------------------- |
| GET    | `/api/contracts`      | 获取合同列表（分页） |
| GET    | `/api/contracts/{id}` | 获取单个合同         |
| POST   | `/api/contracts`      | 创建合同             |
| PUT    | `/api/contracts/{id}` | 更新合同             |
| DELETE | `/api/contracts/{id}` | 删除合同             |

### 客户接口

| 方法   | 路径                | 说明                 |
| ------ | ------------------- | -------------------- |
| GET    | `/api/clients`      | 获取客户列表（分页） |
| GET    | `/api/clients/{id}` | 获取单个客户         |
| POST   | `/api/clients`      | 创建客户             |
| PUT    | `/api/clients/{id}` | 更新客户             |
| DELETE | `/api/clients/{id}` | 删除客户             |

## ⚙️ 配置说明

### 修改后端地址

编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_API_BASE_URL=http://你的后端地址:端口
```

### 修改端口

如果 3000 端口被占用，可以指定其他端口：

```bash
npm run dev -- -p 3001
```

## 🛠️ 开发指南

### 添加新功能

1. 在 `types/index.ts` 中定义 TypeScript 类型
2. 在 `services/` 中创建 API 服务函数
3. 在 `components/` 中创建组件
4. 在 `app/` 中创建页面路由

### 调试技巧

1. **查看网络请求**：打开浏览器开发者工具（F12）-> Network 标签
2. **查看控制台日志**：打开浏览器开发者工具（F12）-> Console 标签
3. **API 错误**：请求拦截器会在控制台打印错误信息

### 常见问题

**Q1: 启动报错 "找不到模块"？**

A: 请确保已经运行 `npm install` 安装所有依赖。

**Q2: 页面显示但无法加载数据？**

A: 请检查：

- 后端 Spring Boot 服务是否已启动
- `.env.local` 中的后端地址是否正确
- 打开浏览器开发者工具，查看 Network 标签中的请求是否成功

**Q3: 跨域问题？**

A: 后端需要配置 CORS 允许跨域。在 Spring Boot 中添加以下配置：

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowCredentials(true);
    }
}
```

**Q4: 修改代码后页面没有更新？**

A: Next.js 支持热更新，保存文件后页面会自动刷新。如果没有，请尝试手动刷新浏览器（Ctrl + F5）。

## 📝 构建生产版本

```bash
# 构建
npm run build

# 启动生产服务器
npm run start
```

## 🎨 设计说明

### 简约风格

- 使用 Ant Design 默认主题
- 首页采用渐变背景，简洁大方
- 表格、表单使用标准组件，易于维护

### 响应式设计

- 表格支持横向滚动，适配小屏幕
- 弹窗宽度自适应
- 移动端友好

## 📖 学习资源

如果你是前端新手，推荐学习以下内容：

1. **React 基础**: https://react.dev/
2. **Next.js 文档**: https://nextjs.org/docs
3. **Ant Design 组件**: https://ant.design/components/overview-cn/
4. **TypeScript 入门**: https://www.typescriptlang.org/docs/

## 📄 许可

MIT License
