---
description: "Create a feature branch with sequential or timestamp numbering"
---

# 创建功能分支

为给定的 specification 创建并切换到新的 git 功能分支。此命令仅处理**分支创建**——spec 目录和文件由核心 `__SPECKIT_COMMAND_SPECIFY__` 工作流创建。

## 用户输入

```text
$ARGUMENTS
```

在继续之前你**必须**考虑用户输入（如果不为空）。

## 环境变量覆盖

如果用户显式提供了 `GIT_BRANCH_NAME`（例如通过环境变量、参数或在请求中），请在调用脚本前通过设置 `GIT_BRANCH_NAME` 环境变量将其传递给脚本。当设置了 `GIT_BRANCH_NAME` 时：
- 脚本使用该确切值作为分支名称，跳过所有前缀/后缀生成逻辑
- `--short-name`、`--number` 和 `--timestamp` 标志将被忽略
- 如果名称以数字前缀开头，则从中提取 `FEATURE_NUM`，否则设置为完整分支名

## 前置条件

- 通过运行 `git rev-parse --is-inside-work-tree 2>/dev/null` 验证 Git 是否可用
- 如果 Git 不可用，警告用户并跳过分支创建

## 分支编号模式

按以下顺序检查配置来确定分支编号策略：

1. 检查 `.specify/extensions/git/git-config.yml` 中的 `branch_numbering` 值
2. 检查 `.specify/init-options.json` 中的 `branch_numbering` 值（向后兼容）
3. 如果两者都不存在，默认使用 `sequential`

## 执行

为分支生成一个简洁的短名称（2-4 个单词）：
- 分析功能描述并提取最有意义的关键词
- 尽可能使用"动作-名词"格式（如 "add-user-auth"、"fix-payment-bug"）
- 保留技术术语和缩写（OAuth2、API、JWT 等）

根据你的平台运行相应的脚本：

- **Bash**：`.specify/extensions/git/scripts/bash/create-new-feature.sh --json --short-name "<short-name>" "<feature description>"`
- **Bash (timestamp)**：`.specify/extensions/git/scripts/bash/create-new-feature.sh --json --timestamp --short-name "<short-name>" "<feature description>"`
- **PowerShell**：`.specify/extensions/git/scripts/powershell/create-new-feature.ps1 -Json -ShortName "<short-name>" "<feature description>"`
- **PowerShell (timestamp)**：`.specify/extensions/git/scripts/powershell/create-new-feature.ps1 -Json -Timestamp -ShortName "<short-name>" "<feature description>"`

**重要提示**：
- 不要传递 `--number`——脚本会自动确定正确的下一个编号
- 始终包含 JSON 标志（Bash 用 `--json`，PowerShell 用 `-Json`），以便可靠地解析输出
- 每个功能只能运行此脚本一次
- JSON 输出将包含 `BRANCH_NAME` 和 `FEATURE_NUM`

## 优雅降级

如果 Git 未安装或当前目录不是 Git 仓库：
- 跳过分支创建并输出警告：`[specify] Warning: Git repository not detected; skipped branch creation`
- 脚本仍然输出 `BRANCH_NAME` 和 `FEATURE_NUM`，以便调用方引用它们

## 输出

脚本输出 JSON 格式数据，包含：
- `BRANCH_NAME`：分支名称（如 `003-user-auth` 或 `20260319-143022-user-auth`）
- `FEATURE_NUM`：使用的数字或时间戳前缀
