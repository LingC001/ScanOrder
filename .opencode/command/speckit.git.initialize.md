---
description: Initialize a Git repository with an initial commit
---


<!-- Extension: git -->
<!-- Config: .specify/extensions/git/ -->
# 初始化 Git 仓库

如果当前项目目录中尚不存在 Git 仓库，则初始化一个。

## 执行

从项目根目录运行相应的脚本：

- **Bash**: `.specify/extensions/git/scripts/bash/initialize-repo.sh`
- **PowerShell**: `.specify/extensions/git/scripts/powershell/initialize-repo.ps1`

如果找不到扩展脚本，则回退到：
- **Bash**: `git init && git add . && git commit -m "Initial commit from Specify template"`
- **PowerShell**: `git init; git add .; git commit -m "Initial commit from Specify template"`

脚本内部处理所有检查：
- 如果 Git 不可用则跳过
- 如果已在 Git 仓库内则跳过
- 运行 `git init`、`git add .` 和 `git commit` 并附带初始提交信息

## 自定义

替换脚本以添加项目特定的 Git 初始化步骤：
- 自定义 `.gitignore` 模板
- 默认分支命名（`git config init.defaultBranch`）
- Git LFS 设置
- Git hooks 安装
- 提交签名配置
- Git Flow 初始化

## 输出

成功时：
- `✓ Git repository initialized`

## 优雅降级

如果未安装 Git：
- 警告用户
- 跳过仓库初始化
- 项目可以在没有 Git 的情况下继续运行（规格说明仍可在 `specs/` 下创建）

如果已安装 Git 但 `git init`、`git add .` 或 `git commit` 失败：
- 向用户显示错误信息
- 停止此命令，而不是继续使用部分初始化的仓库
