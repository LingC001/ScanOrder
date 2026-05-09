# Git 分支工作流扩展

为 Spec Kit 提供 Git 仓库初始化、功能分支创建、编号（顺序/时间戳）、校验、远程仓库检测和自动提交功能。

## 概述

本扩展将 Git 操作作为可选的独立模块提供。它管理以下功能：

- **仓库初始化**，支持可配置的提交信息
- **功能分支创建**，支持顺序编号（`001-feature-name`）或时间戳编号（`20260319-143022-feature-name`）
- **分支校验**，确保分支符合命名规范
- **Git 远程仓库检测**，用于 GitHub 集成（如创建 issue）
- **自动提交**，在核心命令执行后触发（可按命令单独配置启用/禁用和自定义提交信息）

## 命令

| 命令 | 说明 |
|---------|-------------|
| `speckit.git.initialize` | 初始化 Git 仓库，支持可配置的提交信息 |
| `speckit.git.feature` | 创建带顺序或时间戳编号的功能分支 |
| `speckit.git.validate` | 校验当前分支是否符合功能分支命名规范 |
| `speckit.git.remote` | 检测 Git 远程 URL 用于 GitHub 集成 |
| `speckit.git.commit` | 自动提交更改（可按命令单独配置启用/禁用和提交信息） |

## 钩子

| 事件 | 命令 | 可选 | 说明 |
|-------|---------|----------|-------------|
| `before_constitution` | `speckit.git.initialize` | 否 | 在 constitution 之前初始化 git 仓库 |
| `before_specify` | `speckit.git.feature` | 否 | 在 specification 之前创建功能分支 |
| `before_clarify` | `speckit.git.commit` | 是 | 在 clarification 之前提交未完成的更改 |
| `before_plan` | `speckit.git.commit` | 是 | 在 planning 之前提交未完成的更改 |
| `before_tasks` | `speckit.git.commit` | 是 | 在任务生成之前提交未完成的更改 |
| `before_implement` | `speckit.git.commit` | 是 | 在 implementation 之前提交未完成的更改 |
| `before_checklist` | `speckit.git.commit` | 是 | 在 checklist 之前提交未完成的更改 |
| `before_analyze` | `speckit.git.commit` | 是 | 在 analysis 之前提交未完成的更改 |
| `before_taskstoissues` | `speckit.git.commit` | 是 | 在 issue 同步之前提交未完成的更改 |
| `after_constitution` | `speckit.git.commit` | 是 | 在 constitution 更新后自动提交 |
| `after_specify` | `speckit.git.commit` | 是 | 在 specification 后自动提交 |
| `after_clarify` | `speckit.git.commit` | 是 | 在 clarification 后自动提交 |
| `after_plan` | `speckit.git.commit` | 是 | 在 planning 后自动提交 |
| `after_tasks` | `speckit.git.commit` | 是 | 在任务生成后自动提交 |
| `after_implement` | `speckit.git.commit` | 是 | 在 implementation 后自动提交 |
| `after_checklist` | `speckit.git.commit` | 是 | 在 checklist 后自动提交 |
| `after_analyze` | `speckit.git.commit` | 是 | 在 analysis 后自动提交 |
| `after_taskstoissues` | `speckit.git.commit` | 是 | 在 issue 同步后自动提交 |

## 配置

配置存储在 `.specify/extensions/git/git-config.yml` 中：

```yaml
# 分支编号策略："sequential" 或 "timestamp"
branch_numbering: sequential

# git init 的自定义提交信息
init_commit_message: "[Spec Kit] Initial commit"

# 按命令自动提交（默认全部禁用）
# 示例：在 specify 之后启用自动提交
auto_commit:
  default: false
  after_specify:
    enabled: true
    message: "[Spec Kit] Add specification"
```

## 安装

```bash
# 安装内置 git 扩展（无需网络）
specify extension add git
```

## 禁用

```bash
# 禁用 git 扩展（spec 创建将继续但不进行分支操作）
specify extension disable git

# 重新启用
specify extension enable git
```

## 优雅降级

当 Git 未安装或目录不是 Git 仓库时：
- Spec 目录仍会在 `specs/` 下创建
- 跳过分支创建并输出警告
- 跳过分支校验并输出警告
- 远程检测返回空结果

## 脚本

扩展包含跨平台脚本：

- `scripts/bash/create-new-feature.sh` — Bash 实现
- `scripts/bash/git-common.sh` — 共享 Git 工具（Bash）
- `scripts/powershell/create-new-feature.ps1` — PowerShell 实现
- `scripts/powershell/git-common.ps1` — 共享 Git 工具（PowerShell）
