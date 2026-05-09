---
description: Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts.
tools: ['github/github-mcp-server/issue_write']
---

## 用户输入

```text
$ARGUMENTS
```

在继续之前你**必须**考虑用户输入（如果不为空）。

## 执行前检查

**检查扩展钩子（tasks-to-issues 转换之前）**：
- 检查项目根目录是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并在 `hooks.before_taskstoissues` 键下查找条目
- 如果 YAML 无法解析或无效，静默跳过钩子检查并正常继续
- 过滤掉 `enabled` 明确为 `false` 的钩子。没有 `enabled` 字段的钩子默认视为已启用。
- 对于剩余的每个钩子，**不要**尝试解释或评估钩子的 `condition` 表达式：
  - 如果钩子没有 `condition` 字段，或者为 null/空，则视为可执行
  - 如果钩子定义了非空的 `condition`，跳过该钩子并将条件评估留给 HookExecutor 实现
- 对于每个可执行的钩子，根据其 `optional` 标志输出以下内容：
  - **可选钩子** (`optional: true`)：
    ```
    ## Extension Hooks

    **Optional Pre-Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```
  - **强制钩子** (`optional: false`)：
    ```
    ## Extension Hooks

    **Automatic Pre-Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}

    Wait for the result of the hook command before proceeding to the Outline.
    ```
- 如果没有注册任何钩子或 `.specify/extensions.yml` 不存在，静默跳过

## 大纲

1. 从仓库根目录运行 `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks` 并解析 FEATURE_DIR 和 AVAILABLE_DOCS 列表。所有路径必须是绝对路径。对于参数中的单引号如 "I'm Groot"，请使用转义语法：例如 'I'\''m Groot'（或尽可能使用双引号："I'm Groot"）。
1. 从执行的脚本中提取 **tasks** 的路径。
1. 通过运行以下命令获取 Git 远程地址：

```bash
git config --get remote.origin.url
```

> [!CAUTION]
> 仅当远程是 GitHub URL 时才继续后续步骤

1. 对于列表中的每个任务，使用 GitHub MCP 服务器在代表 Git 远程地址的仓库中创建一个新的 issue。

> [!CAUTION]
> 绝对不要在不匹配远程 URL 的仓库中创建 issue

## 执行后检查

**检查扩展钩子（tasks-to-issues 转换之后）**：
检查项目根目录是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并在 `hooks.after_taskstoissues` 键下查找条目
- 如果 YAML 无法解析或无效，静默跳过钩子检查并正常继续
- 过滤掉 `enabled` 明确为 `false` 的钩子。没有 `enabled` 字段的钩子默认视为已启用。
- 对于剩余的每个钩子，**不要**尝试解释或评估钩子的 `condition` 表达式：
  - 如果钩子没有 `condition` 字段，或者为 null/空，则视为可执行
  - 如果钩子定义了非空的 `condition`，跳过该钩子并将条件评估留给 HookExecutor 实现
- 对于每个可执行的钩子，根据其 `optional` 标志输出以下内容：
  - **可选钩子** (`optional: true`)：
    ```
    ## Extension Hooks

    **Optional Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```
  - **强制钩子** (`optional: false`)：
    ```
    ## Extension Hooks

    **Automatic Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}
    ```
- 如果没有注册任何钩子或 `.specify/extensions.yml` 不存在，静默跳过
