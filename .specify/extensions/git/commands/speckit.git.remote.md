---
description: "Detect Git remote URL for GitHub integration"
---

# 检测 Git 远程 URL

检测 Git 远程 URL 以便与 GitHub 服务集成（如创建 issue）。

## 前置条件

- 通过运行 `git rev-parse --is-inside-work-tree 2>/dev/null` 检查 Git 是否可用
- 如果 Git 不可用，输出警告并返回空值：
  ```
  [specify] Warning: Git repository not detected; cannot determine remote URL
  ```

## 执行

运行以下命令获取远程 URL：

```bash
git config --get remote.origin.url
```

## 输出

解析远程 URL 并确定以下信息：

1. **仓库所有者**：从 URL 中提取（例如从 `https://github.com/github/spec-kit.git` 中提取 `github`）
2. **仓库名称**：从 URL 中提取（例如从 `https://github.com/github/spec-kit.git` 中提取 `spec-kit`）
3. **是否为 GitHub**：远程地址是否指向 GitHub 仓库

支持的 URL 格式：
- HTTPS：`https://github.com/<owner>/<repo>.git`
- SSH：`git@github.com:<owner>/<repo>.git`

> [!CAUTION]
> 仅当远程 URL 实际指向 github.com 时才报告为 GitHub 仓库。
> 如果 URL 格式不匹配，不要假设远程是 GitHub。

## 优雅降级

如果 Git 未安装、目录不是 Git 仓库或未配置远程：
- 返回空结果
- 不要报错——其他工作流应继续执行，不依赖 Git 远程信息
