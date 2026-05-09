---
description: Auto-commit changes after a Spec Kit command completes
---


<!-- Extension: git -->
<!-- Config: .specify/extensions/git/ -->
# 自动提交更改

在 Spec Kit 命令完成后，自动暂存并提交所有更改。

## 行为

此命令作为钩子在核心命令之后（或之前）被调用。它会：

1. 从钩子上下文中确定事件名称（例如，如果作为 `after_specify` 钩子被调用，则事件为 `after_specify`；如果是 `before_plan`，则事件为 `before_plan`）
2. 检查 `.specify/extensions/git/git-config.yml` 中的 `auto_commit` 部分
3. 查找特定的事件键以确认是否启用了自动提交
4. 如果不存在特定于事件的键，则回退到 `auto_commit.default`
5. 如果已配置，使用每个命令的 `message`，否则使用默认消息
6. 如果已启用且存在未提交的更改，运行 `git add .` + `git commit`

## 执行

从触发此命令的钩子中确定事件名称，然后运行脚本：

- **Bash**: `.specify/extensions/git/scripts/bash/auto-commit.sh <event_name>`
- **PowerShell**: `.specify/extensions/git/scripts/powershell/auto-commit.ps1 <event_name>`

将 `<event_name>` 替换为实际的钩子事件（例如 `after_specify`、`before_plan`、`after_implement`）。

## 配置

在 `.specify/extensions/git/git-config.yml` 中：

```yaml
auto_commit:
  default: false          # 全局开关 — 设为 true 以对所有命令启用
  after_specify:
    enabled: true          # 按命令覆盖
    message: "[Spec Kit] Add specification"
  after_plan:
    enabled: false
    message: "[Spec Kit] Add implementation plan"
```

## 优雅降级

- 如果 Git 不可用或当前目录不是仓库：输出警告后跳过
- 如果配置文件不存在：跳过（默认禁用）
- 如果没有需要提交的更改：输出消息后跳过
