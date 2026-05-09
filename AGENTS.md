# ScanOrder — QR Code Ordering App

## 语言与交互规范

- **思考与输出语言**：内部思考和最终输出（含代码注释、日志、文档）全程使用**简体中文**
- **代码规范**：仅关键字/API 名称保留英文，其余使用中文
- **术语处理**：优先中文通用译名（如 function→函数），无译名时保留英文

## 项目结构

Monorepo，**2个独立子项目**（无根 workspace），各自有 `node_modules` 和 `package.json`，均使用 **pnpm**

| 目录 | 技术栈 | 用途 |
|------|--------|------|
| `ScanOrder-backend/` | NestJS 9 + TS + Mongoose + MongoDB | REST API 服务 |
| `ScanOrder-Frontend/` | Vue 3 + Vite + TS + Pinia + Vant 4 | 前端 |

## 开发命令

### 后端 (`ScanOrder-backend/`)

```sh
pnpm install       # 安装依赖
pnpm start:dev     # 开发服务器（watch 模式，NODE_ENV=development）
pnpm build         # 生产构建到 dist/
pnpm start:prod    # 运行生产构建（NODE_ENV=production）
pnpm lint          # ESLint（--fix）
pnpm test          # Jest 单元测试（src/**/*.spec.ts）
pnpm test:e2e      # E2E 测试（test/*.e2e-spec.ts）
pnpm format        # Prettier
```

### 前端 (`ScanOrder-Frontend/`)

```sh
pnpm install    # 安装依赖
pnpm dev        # Vite 开发服务器
pnpm build      # 并行运行 type-check (vue-tsc) + vite build
pnpm lint       # ESLint（--fix）
pnpm format     # Prettier
```

## 后端架构

- **入口**：`src/main.ts` → `AppModule`（`src/app.module.ts`）
- **端口**：3000
- **API 前缀**：`/api`
- **数据库**：MongoDB `mongodb://localhost:27017/ScanOrder`（硬编码）
- **模块**：`foods/`（菜品）、`orders/`（订单）
- **NestJS 规范**：每个模块含 `*.module.ts`、`*.controller.ts`、`*.service.ts`、`dto/`、`schemas/`、`entities/`
- **静态文件**：`public/upload/` 映射到 `/images`
- **校验**：全局 `ValidationPipe`（whitelist + transform + forbidNonWhitelisted + 隐式转换）
- **CORS**：已启用

## 前端架构

- **入口**：`src/main.ts` → `App.vue` → `src/router/index.ts`
- **UI 库**：Vant 4（自动导入，无需手动import）
- **状态管理**：Pinia stores（`src/stores/`）
- **HTTP**：Axios，基础 URL 在 `src/config/config.ts` 中配置
- **路由**：Vue Router，包含 entry、choose、orderList、submitOrder、upload 页面
- **路径别名**：`@` → `src/`
- **构建**：TS 版并行运行 type-check + build

## 关键配置

### 数据库连接
- **MongoDB 必须本地运行**在 27017 端口
- **无 `.env` 文件** — 数据库 URI 硬编码，修改需编辑 `ScanOrder-backend/src/app.module.ts`

### 前端API配置
- **默认API地址**：`http://150.158.166.35/api/`
- **本地开发**：需修改 `ScanOrder-Frontend/src/config/config.ts` 中的 `env` 为 `http://localhost:3000`
- **无代理配置** — Vite 配置未设置 dev proxy 到后端

### TypeScript 配置
- **后端 TS 严格模式已关闭**：`strictNullChecks`、`noImplicitAny`、`forceConsistentCasingInFileNames` 设为 false
- **不要直接开启严格模式** — 需先修复现有代码

## 开发注意事项

1. **启动顺序**：先启动 MongoDB，再启动后端，最后启动前端
2. **测试运行**：前端构建包含类型检查，后端有单元测试和 E2E 测试
3. **代码格式化**：项目使用 ESLint + Prettier，提交前运行格式化命令
4. **静态资源**：后端 `/images` 路由映射 `public/upload` 目录，用于文件上传