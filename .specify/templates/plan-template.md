# 实施计划：[FEATURE]

**分支**：`[###-feature-name]` | **日期**：[DATE] | **规格**：[链接]
**输入**：来自 `/specs/[###-feature-name]/spec.md` 的功能规格说明

**备注**：此模板由 `/speckit.plan` 命令填充。执行工作流请参见 `.specify/templates/plan-template.md`。

## 摘要

[从功能规格中提取：主要需求 + 来自研究的技术方案]

## 技术上下文

<!--
  操作要求：将本节内容替换为项目的具体技术细节。
  此处的结构仅供参考，用于指导迭代过程。
-->

**语言/版本**：[例如 Python 3.11、Swift 5.9、Rust 1.75 或 需澄清]  
**主要依赖**：[例如 FastAPI、UIKit、LLVM 或 需澄清]  
**存储**：[如适用，例如 PostgreSQL、CoreData、文件 或 不适用]  
**测试**：[例如 pytest、XCTest、cargo test 或 需澄清]  
**目标平台**：[例如 Linux 服务器、iOS 15+、WASM 或 需澄清]
**项目类型**：[例如 库/CLI/Web 服务/移动应用/编译器/桌面应用 或 需澄清]  
**性能目标**：[领域特定，例如 1000 req/s、10k 行/秒、60 fps 或 需澄清]  
**约束条件**：[领域特定，例如 <200ms p95、<100MB 内存、支持离线 或 需澄清]  
**规模/范围**：[领域特定，例如 1万用户、100万行代码、50 个屏幕 或 需澄清]

## 规范检查

*门槛：必须在阶段 0 研究之前通过。阶段 1 设计后重新检查。*

[基于规范文件确定的门槛]

## 项目结构

### 文档（本功能）

```text
specs/[###-feature]/
├── plan.md              # 本文件（/speckit.plan 命令输出）
├── research.md          # 阶段 0 输出（/speckit.plan 命令）
├── data-model.md        # 阶段 1 输出（/speckit.plan 命令）
├── quickstart.md        # 阶段 1 输出（/speckit.plan 命令）
├── contracts/           # 阶段 1 输出（/speckit.plan 命令）
└── tasks.md             # 阶段 2 输出（/speckit.tasks 命令 — 非 /speckit.plan 创建）
```

### 源代码（仓库根目录）
<!--
  操作要求：将下方的占位符目录树替换为本功能的具体布局。
  删除未使用的选项，并用真实路径展开所选结构
  （例如 apps/admin、packages/something）。交付的计划不得包含选项标签。
-->

```text
# [如未使用则删除] 选项 1：单项目（默认）
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [如未使用则删除] 选项 2：Web 应用（检测到 "frontend" + "backend" 时）
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [如未使用则删除] 选项 3：移动端 + API（检测到 "iOS/Android" 时）
api/
└── [同上方 backend]

ios/ or android/
└── [平台特定结构：功能模块、UI 流程、平台测试]
```

**结构决策**：[记录所选结构并引用上面捕获的真实目录]

## 复杂度追踪

> **仅在规范检查存在违规且需要论证时填写**

| 违规项 | 为何需要 | 拒绝更简单方案的原因 |
|--------|----------|---------------------|
| [例如 第 4 个项目] | [当前需求] | [为何 3 个项目不够] |
| [例如 Repository 模式] | [具体问题] | [为何直接访问数据库不足] |
