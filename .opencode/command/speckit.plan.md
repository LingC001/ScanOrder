---
description: 使用方案模板执行实施规划工作流以生成设计产物。
handoffs: 
  - label: 创建任务
    agent: speckit.tasks
    prompt: 将方案分解为任务
    send: true
  - label: 创建清单
    agent: speckit.checklist
    prompt: 为以下领域创建清单...
---

## 用户输入

```text
$ARGUMENTS
```

在继续之前，你**必须**考虑用户输入（如果不为空）。

## 执行前检查

**检查扩展钩子（规划之前）**：
- 检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.before_plan` 键下的条目
- 如果 YAML 无法解析或无效，静默跳过钩子检查并正常继续
- 过滤掉 `enabled` 明确为 `false` 的钩子。没有 `enabled` 字段的钩子默认视为启用。
- 对于每个剩余的钩子，**不要**尝试解释或评估钩子的 `condition` 表达式：
  - 如果钩子没有 `condition` 字段，或者为 null/空值，则将钩子视为可执行
  - 如果钩子定义了非空的 `condition`，则跳过该钩子，将条件评估留给 HookExecutor 实现
- 对于每个可执行的钩子，根据其 `optional` 标志输出以下内容：
  - **可选钩子** (`optional: true`)：
    ```
    ## 扩展钩子

    **可选前置钩子**: {extension}
    命令: `/{command}`
    描述: {description}

    提示: {prompt}
    执行方式: `/{command}`
    ```
  - **强制钩子** (`optional: false`)：
    ```
    ## 扩展钩子

    **自动前置钩子**: {extension}
    正在执行: `/{command}`
    EXECUTE_COMMAND: {command}

    在继续到大纲之前等待钩子命令的结果。
    ```
- 如果没有注册任何钩子或 `.specify/extensions.yml` 不存在，则静默跳过

## 大纲

1. **初始化设置**：从仓库根目录运行 `.specify/scripts/powershell/setup-plan.ps1 -Json` 并解析 JSON 获取 FEATURE_SPEC、IMPL_PLAN、SPECS_DIR、BRANCH。对于参数中类似 "I'm Groot" 的单引号，使用转义语法：例如 'I'\''m Groot'（如果可能的话使用双引号："I'm Groot"）。

2. **加载上下文**：读取 FEATURE_SPEC 和 `.specify/memory/constitution.md`。加载 IMPL_PLAN 模板（已复制）。

3. **执行规划工作流**：遵循 IMPL_PLAN 模板中的结构：
   - 填写技术上下文（将未知项标记为 "NEEDS CLARIFICATION"）
   - 从 constitution 填写 Constitution Check 章节
   - 评估门控条件（如果违规无正当理由则报错）
   - Phase 0：生成 research.md（解决所有 NEEDS CLARIFICATION）
   - Phase 1：生成 data-model.md、contracts/、quickstart.md
   - Phase 1：通过运行 agent 脚本更新 agent 上下文
   - 设计后重新评估 Constitution Check

4. **停止并报告**：Phase 2 规划结束后命令终止。报告分支、IMPL_PLAN 路径和生成的产物。

5. **检查扩展钩子**：报告完成后，检查项目根目录下是否存在 `.specify/extensions.yml`。
   - 如果存在，读取它并查找 `hooks.after_plan` 键下的条目
   - 如果 YAML 无法解析或无效，静默跳过钩子检查并正常继续
   - 过滤掉 `enabled` 明确为 `false` 的钩子。没有 `enabled` 字段的钩子默认视为启用。
   - 对于每个剩余的钩子，**不要**尝试解释或评估钩子的 `condition` 表达式：
     - 如果钩子没有 `condition` 字段，或者为 null/空值，则将钩子视为可执行
     - 如果钩子定义了非空的 `condition`，则跳过该钩子，将条件评估留给 HookExecutor 实现
   - 对于每个可执行的钩子，根据其 `optional` 标志输出以下内容：
     - **可选钩子** (`optional: true`)：
       ```
       ## 扩展钩子

       **可选钩子**: {extension}
       命令: `/{command}`
       描述: {description}

       提示: {prompt}
       执行方式: `/{command}`
       ```
     - **强制钩子** (`optional: false`)：
       ```
       ## 扩展钩子

       **自动钩子**: {extension}
       正在执行: `/{command}`
       EXECUTE_COMMAND: {command}
       ```
   - 如果没有注册任何钩子或 `.specify/extensions.yml` 不存在，则静默跳过

## 阶段

### Phase 0: 大纲与研究

1. **从上述技术上下文中提取未知项**：
   - 每个 NEEDS CLARIFICATION → 研究任务
   - 每个依赖 → 最佳实践任务
   - 每个集成 → 模式任务

2. **生成并分派研究 agent**：

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **整合研究结果**到 `research.md`，使用以下格式：
   - 决策：[选择了什么]
   - 理由：[为什么这样选择]
   - 考虑过的替代方案：[还评估了什么]

**输出**：research.md，其中所有 NEEDS CLARIFICATION 已解决

### Phase 1: 设计与契约

**前提条件**：`research.md` 已完成

1. **从功能规格中提取实体** → `data-model.md`：
   - 实体名称、字段、关系
   - 来自需求的验证规则
   - 如适用，状态转换

2. **定义接口契约**（如果项目有外部接口） → `/contracts/`：
   - 识别项目向用户或其他系统暴露哪些接口
   - 记录适合项目类型的契约格式
   - 示例：库的公共 API、CLI 工具的命令模式、Web 服务的端点、解析器的语法、应用程序的 UI 契约
   - 如果项目纯粹是内部使用的（构建脚本、一次性工具等），则跳过

3. **Agent 上下文更新**：
   - 更新 `AGENTS.md` 中 `<!-- SPECKIT START -->` 和 `<!-- SPECKIT END -->` 标记之间的方案引用，使其指向步骤 1 创建的方案文件（IMPL_PLAN 路径）

**输出**：data-model.md、/contracts/*、quickstart.md、更新的 agent 上下文文件

## 关键规则

- 文件系统操作使用绝对路径；文档和 agent 上下文文件中的引用使用项目相对路径
- 门控失败或未解决的澄清时报错
