# 100 Apps Monorepo 架构设计

## 目录结构

```
100apps/
├── app/                          # Next.js 应用路由
│   ├── (home)/                   # 主页组
│   │   └── page.tsx             # 主页
│   ├── apps/                     # 应用路由组
│   │   ├── [slug]/              # 动态应用路由
│   │   │   └── page.tsx         # 应用页面
│   │   └── layout.tsx           # 应用布局
│   ├── admin/                    # 管理面板
│   ├── globals.css
│   └── layout.tsx
├── apps/                         # 所有应用目录
│   ├── calculator/               # 计算器应用
│   │   ├── index.tsx            # 应用组件
│   │   ├── calculator.module.css
│   │   └── README.md
│   ├── todo-list/               # 待办事项
│   ├── weather/                 # 天气应用
│   └── ...
├── shared/                       # 共享资源
│   ├── components/              # 共享组件
│   ├── hooks/                   # 共享 hooks
│   ├── utils/                   # 工具函数
│   ├── types/                   # 类型定义
│   └── constants/               # 常量
├── lib/                         # 核心库
│   ├── app-registry.ts          # 应用注册系统
│   ├── router.ts                # 应用路由器
│   └── loader.ts                # 动态加载器
└── public/                      # 静态资源
    └── apps/                    # 应用相关资源
```

## 路由方案

### 子域名路由（推荐）
- `your100apps.com` - 主页
- `calculator.your100apps.com` - 计算器应用
- `todo.your100apps.com` - 待办事项应用

### 路径路由（备选）
- `your100apps.com/` - 主页
- `your100apps.com/apps/calculator` - 计算器应用
- `your100apps.com/apps/todo` - 待办事项应用

## 应用注册系统

每个应用都需要：
1. 应用配置文件 (`app.config.ts`)
2. 主组件 (`index.tsx`)
3. 应用元数据
4. 路由配置

## 技术特性

- **按需加载**: 只加载当前访问的应用
- **共享组件**: 统一的 UI 组件库
- **类型安全**: 完整的 TypeScript 支持
- **SEO 优化**: 每个应用独立的 SEO 配置
- **响应式**: 适配所有设备
- **主题系统**: 支持暗色/亮色模式

## 部署策略

- **Cloudflare Pages**: 自动部署和 CDN
- **子域名配置**: 通配符 DNS 设置
- **边缘计算**: 利用 Cloudflare Workers