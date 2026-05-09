---
description: Create a feature branch with sequential or timestamp numbering
---


<!-- Extension: git -->
<!-- Config: .specify/extensions/git/ -->
# 创建功能分支

为给定的规格说明创建并切换到一个新的 git 功能分支。此命令仅处理**分支创建** — spec 目录和文件由核心 `/speckit.specify` 工作流创建。

## 用户输入

```text
$ARGUMENTS
```

在继续之前你**必须**考虑用户输入（如果不为空）。

## 环境变量覆盖

如果用户明确提供了 `GIT_BRANCH_NAME`（例如通过环境变量、参数或在请求中），请在调用脚本前设置 `GIT_BRANCH_NAME` 环境变量并将其传递给脚本。当设置了 `GIT_BRANCH_NAME` 时：
- 脚本将使用该确切值作为分支名称，绕过所有前缀/后缀生成逻辑
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
- 尽可能使用"动作-名词"格式（例如 "add-user-auth"、"fix-payment-bug"）
- 保留技术术语和缩写（OAuth2、API、JWT 等）

根据你的平台运行相应的脚本：

- **Bash**: `.specify/extensions/git/scripts/bash/create-new-feature.sh --json --short-name "<short-name>" "<feature description>"`
- **Bash (时间戳)**: `.specify/extensions/git/scripts/bash/create-new-feature.sh --json --timestamp --short-name "<short-name>" "<feature description>"`
- **PowerShell**: `.specify/extensions/git/scripts/powershell/create-new-feature.ps1 -Json -ShortName "<short-name>" "<feature description>"`
- **PowerShell (时间戳)**: `.specify/extensions/git/scripts/powershell/create-new-feature.ps1 -Json -Timestamp -ShortName "<short-name>" "<feature description>"`

**重要提示**：
- 不要传递 `--number` — 脚本会自动确定正确的下一个编号
- 始终包含 JSON 标志（Bash 用 `--json`，PowerShell 用 `-Json`），以便可靠地解析输出
- 每个功能只能运行一次此脚本
- JSON 输出将包含 `BRANCH_NAME` 和 `FEATURE_NUM`

## 优雅降级

如果未安装 Git 或当前目录不是 Git 仓库：
- 分支创建将被跳过并输出警告：`[specify] Warning: Git repository not detected; skipped branch creation`
- 脚本仍会输出 `BRANCH_NAME` 和 `FEATURE_NUM` 以供调用方引用

## 输出

脚本输出包含以下内容的 JSON：
- `BRANCH_NAME`：分支名称（例如 `003-user-auth` 或 `20260319-143022-user-auth`）
- `FEATURE_NUM`：使用的数字或时间戳前缀
