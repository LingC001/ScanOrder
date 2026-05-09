---
description: Validate current branch follows feature branch naming conventions
---


<!-- Extension: git -->
<!-- Config: .specify/extensions/git/ -->
# 验证功能分支

验证当前 Git 分支是否符合预期的功能分支命名规范。

## 前置条件

- 通过运行 `git rev-parse --is-inside-work-tree 2>/dev/null` 检查 Git 是否可用
- 如果 Git 不可用，输出警告并跳过验证：
  ```
  [specify] Warning: Git repository not detected; skipped branch validation
  ```

## 验证规则

获取当前分支名称：

```bash
git rev-parse --abbrev-ref HEAD
```

分支名称必须匹配以下模式之一：

1. **顺序编号**: `^[0-9]{3,}-`（例如 `001-feature-name`、`042-fix-bug`、`1000-big-feature`）
2. **时间戳**: `^[0-9]{8}-[0-9]{6}-`（例如 `20260319-143022-feature-name`）

## 执行

如果在功能分支上（匹配任一模式）：
- 输出：`✓ On feature branch: <branch-name>`
- 检查 `specs/` 下是否存在对应的 spec 目录：
  - 对于顺序编号分支，查找 `specs/<prefix>-*`，其中 prefix 匹配数字部分
  - 对于时间戳分支，查找 `specs/<prefix>-*`，其中 prefix 匹配 `YYYYMMDD-HHMMSS` 部分
- 如果 spec 目录存在：`✓ Spec directory found: <path>`
- 如果缺少 spec 目录：`⚠ No spec directory found for prefix <prefix>`

如果不在功能分支上：
- 输出：`✗ Not on a feature branch. Current branch: <branch-name>`
- 输出：`Feature branches should be named like: 001-feature-name or 20260319-143022-feature-name`

## 优雅降级

如果未安装 Git 或目录不是 Git 仓库：
- 检查 `SPECIFY_FEATURE` 环境变量作为回退方案
- 如果已设置，验证该值是否符合命名模式
- 如果未设置，输出警告后跳过验证
