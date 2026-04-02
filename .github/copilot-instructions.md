# 3Dblog - AI Agent Instructions

> 沉浸式 3D 博客应用，基于 Next.js 16 + React Three Fiber + Zustand

## 快速命令

```bash
npm run dev          # 开发服务器 (http://127.0.0.1:3000)
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run test         # 运行 Vitest 单元测试
npm run test:e2e     # 运行 Playwright E2E 测试
npm run lint         # ESLint 检查
npm run typecheck    # TypeScript 类型检查
```

## 架构概览

应用分为三层：

| 层级    | Z-index | 技术           | 职责                     |
| ------- | ------- | -------------- | ------------------------ |
| 3D 场景 | z-0     | Three.js / R3F | 超立方体、星空、相机动画 |
| UI 覆盖 | z-10~20 | Framer Motion  | 导航、文章列表、作者信息 |
| 阅读层  | z-50    | React Markdown | 文章渲染、目录、代码高亮 |

**状态驱动**: Zustand store 控制 `ViewMode`（home/blog/author/friend/reading/focus），所有 UI 和 3D 相机位置响应模式变化。

## 关键目录

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页（3D 场景入口）
│   └── posts/[slug]/       # 文章详情页
├── components/
│   ├── canvas/             # 3D 组件 (Scene, Hypercube, StarField)
│   ├── dom/                # UI 覆盖组件 (Navigation, PostList, etc.)
│   └── article/            # 文章渲染 (ArticleView, ArticleToc)
├── lib/
│   ├── data.ts             # 传统博客数据加载
│   └── content/            # 现代化内容系统 (Markdown 解析、路由)
├── store/
│   └── store.ts            # Zustand 全局状态
└── test/
    └── setup.ts            # Vitest 测试 setup
content/                    # 博客内容源
public/                     # 静态资源
```

## 重要约定

### TypeScript

- `strict: true`，路径别名 `@/*` → `./src/*`
- **3D 组件使用 `// @ts-nocheck`**（Three.js 类型兼容问题），但新增非 3D 代码必须通过类型检查

### React 组件

- 客户端组件：3D 和交互组件使用 `"use client"` 指令
- 服务端组件：页面入口 (`page.tsx`) 默认 SSR，异步获取数据
- 文件命名：PascalCase，与组件名一致
- 测试共定位：`*.test.tsx` 与源文件同级

### 内容系统

- 内容源位于 `content/` 目录，支持 `myblog/` 和 `blog/` 两个根
- Markdown 解析使用 `gray-matter` (frontmatter) + `markdown-it` (渲染)
- 文章路由：`posts/[slug]/page.tsx` 使用 `generateStaticParams()` 预生成

### 状态管理

- 单一 Zustand store (`src/store/store.ts`)
- 模式驱动 UI 显示/隐藏
- 导航通过 action 函数完成（`goHome`, `enterReading`, etc.）

### 测试

- 单元测试：Vitest + Testing Library + jsdom
- E2E 测试：Playwright
- Setup 文件模拟 `IntersectionObserver` 和 `matchMedia`

## 常见陷阱

1. **3D 组件 `@ts-nocheck`**: 所有 canvas 组件禁用类型检查，修改时注意运行时行为
2. **文件系统同步读取**: `getPosts()` 使用 `fs.readFileSync`，SSR 时可能影响性能
3. **内容路径硬编码**: 依赖 `process.cwd()`，部署时需确保内容目录存在
4. **wheel 事件处理**: `SlideController.tsx` 直接操作 DOM 滚动，可能与 React 渲染冲突
5. **`dangerouslySetInnerHTML`**: 文章渲染使用 innerHTML，注意 XSS 防护
6. **Next.js 16 兼容性**: 使用 `--webpack` 标志，与 Turbopack 不兼容

## 部署

CI/CD 通过 GitHub Actions 部署到 CentOS 服务器：

- 构建后打包 `.next`, `public`, `package.json`
- SCP 上传到服务器
- PM2 管理 Next.js 进程

## 相关文档

- [内容源说明](../content/source/README.md)
- [部署配置](../.github/workflows/deploy.yml)
