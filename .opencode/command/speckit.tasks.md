---
description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
handoffs: 
  - label: Analyze For Consistency
    agent: speckit.analyze
    prompt: Run a project analysis for consistency
    send: true
  - label: Implement Project
    agent: speckit.implement
    prompt: Start the implementation in phases
    send: true
---

## 用户输入

```text
$ARGUMENTS
```

在继续之前你**必须**考虑用户输入（如果不为空）。

## 执行前检查

**检查扩展钩子（任务生成之前）**：
- 检查项目根目录是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并在 `hooks.before_tasks` 键下查找条目
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

1. **准备**：从仓库根目录运行 `.specify/scripts/powershell/setup-tasks.ps1 -Json` 并解析 FEATURE_DIR、TASKS_TEMPLATE 和 AVAILABLE_DOCS 列表。`FEATURE_DIR` 和 `TASKS_TEMPLATE` 在提供时必须是绝对路径。`AVAILABLE_DOCS` 是 `FEATURE_DIR` 下可用的文档名称/相对路径列表（例如 `research.md` 或 `contracts/`）。对于参数中的单引号如 "I'm Groot"，请使用转义语法：例如 'I'\''m Groot'（或尽可能使用双引号："I'm Groot"）。

2. **加载设计文档**：从 FEATURE_DIR 读取：
   - **必需**：plan.md（技术栈、库、结构）、spec.md（带优先级的用户故事）
   - **可选**：data-model.md（实体）、contracts/（接口契约）、research.md（决策记录）、quickstart.md（测试场景）
   - 注意：并非所有项目都有所有文档。根据现有内容生成任务。

3. **执行任务生成工作流**：
   - 加载 plan.md 并提取技术栈、库、项目结构
   - 加载 spec.md 并提取用户故事及其优先级（P1、P2、P3 等）
   - 如果 data-model.md 存在：提取实体并映射到用户故事
   - 如果 contracts/ 存在：将接口契约映射到用户故事
   - 如果 research.md 存在：提取用于设置任务的决策
   - 按用户故事组织生成任务（参见下方的任务生成规则）
   - 生成展示用户故事完成顺序的依赖关系图
   - 为每个用户故事创建并行执行示例
   - 验证任务完整性（每个用户故事都具备所需任务，可独立测试）

4. **生成 tasks.md**：从 TASKS_TEMPLATE（来自上述 JSON 输出）读取任务模板并作为结构使用。如果 TASKS_TEMPLATE 为空，则回退到 `.specify/templates/tasks-template.md`。填充以下内容：
   - 来自 plan.md 的正确功能名称
   - 阶段 1：设置任务（项目初始化）
   - 阶段 2：基础任务（所有用户故事的阻塞前置条件）
   - 阶段 3+：每个用户故事一个阶段（按 spec.md 中的优先级排序）
   - 每个阶段包括：故事目标、独立测试标准、测试（如果请求）、实现任务
   - 最终阶段：完善与横切关注点
   - 所有任务必须遵循严格的清单格式（参见下方的任务生成规则）
   - 每个任务的清晰文件路径
   - 展示故事完成顺序的依赖关系部分
   - 每个故事的并行执行示例
   - 实现策略部分（MVP 优先，增量交付）

5. **报告**：输出生成的 tasks.md 路径和摘要：
   - 任务总数
   - 每个用户故事的任务数
   - 已识别的并行机会
   - 每个故事的独立测试标准
   - 建议的 MVP 范围（通常仅为 User Story 1）
   - 格式验证：确认所有任务均遵循清单格式（复选框、ID、标签、文件路径）

6. **检查扩展钩子**：tasks.md 生成后，检查项目根目录是否存在 `.specify/extensions.yml`。
   - 如果存在，读取它并在 `hooks.after_tasks` 键下查找条目
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
       EXECUTE_COMMAND: {command}`
       ```
   - 如果没有注册任何钩子或 `.specify/extensions.yml` 不存在，静默跳过

任务生成的上下文：$ARGUMENTS

tasks.md 应当可以立即执行 — 每个任务都必须足够具体，以便 LLM 无需额外上下文即可完成。

## 任务生成规则

**关键**：任务必须按用户故事组织，以支持独立实现和测试。

**测试是可选的**：仅在功能规格说明中明确请求或用户要求 TDD 方法时才生成测试任务。

### 清单格式（必需）

每个任务必须严格遵循以下格式：

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**格式组成部分**：

1. **复选框**：始终以 `- [ ]` 开头（markdown 复选框）
2. **任务 ID**：按执行顺序的序号（T001、T002、T003...）
3. **[P] 标记**：仅当任务可并行化时包含（不同文件，不依赖于未完成的任务）
4. **[Story] 标签**：仅对用户故事阶段任务必需
   - 格式：[US1]、[US2]、[US3] 等（映射自 spec.md 的用户故事）
   - 设置阶段：无故事标签
   - 基础阶段：无故事标签
   - 用户故事阶段：必须有故事标签
   - 完善阶段：无故事标签
5. **描述**：带有明确文件路径的操作说明

**示例**：

- ✅ 正确：`- [ ] T001 Create project structure per implementation plan`
- ✅ 正确：`- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
- ✅ 正确：`- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ✅ 正确：`- [ ] T014 [US1] Implement UserService in src/services/user_service.py`
- ❌ 错误：`- [ ] Create User model`（缺少 ID 和 Story 标签）
- ❌ 错误：`T001 [US1] Create model`（缺少复选框）
- ❌ 错误：`- [ ] [US1] Create User model`（缺少 Task ID）
- ❌ 错误：`- [ ] T001 [US1] Create model`（缺少文件路径）

### 任务组织方式

1. **来自用户故事（spec.md）** — 主要组织方式：
   - 每个用户故事（P1、P2、P3...）拥有自己的阶段
   - 将所有相关组件映射到其所属故事：
     - 该故事所需的模型
     - 该故事所需的服务
     - 该故事所需的接口/UI
     - 如果请求测试：该故事特有的测试
   - 标记故事间依赖关系（大多数故事应当相互独立）

2. **来自契约**：
   - 将每个接口契约 → 映射到它所服务的用户故事
   - 如果请求测试：每个接口契约 → 在该故事阶段的实现之前添加契约测试任务 [P]

3. **来自数据模型**：
   - 将每个实体映射到需要它的用户故事
   - 如果实体服务于多个故事：放入最早的故事或设置阶段
   - 关系 → 相应故事阶段的服务层任务

4. **来自设置/基础设施**：
   - 共享基础设施 → 设置阶段（阶段 1）
   - 基础/阻塞任务 → 基础阶段（阶段 2）
   - 故事特定设置 → 放入该故事阶段内部

### 阶段结构

- **阶段 1**：设置（项目初始化）
- **阶段 2**：基础（阻塞前置条件 — 必须在用户故事之前完成）
- **阶段 3+**：按优先级排列的用户故事（P1、P2、P3...）
  - 每个故事内部：测试（如果请求）→ 模型 → 服务 → 端点 → 集成
  - 每个阶段应该是一个完整的、可独立测试的增量
- **最终阶段**：完善与横切关注点
