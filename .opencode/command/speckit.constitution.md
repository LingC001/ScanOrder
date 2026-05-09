---
description: 从交互式或提供的原则输入创建或更新项目宪法，确保所有依赖模板保持同步。
handoffs: 
  - label: 构建规格
    agent: speckit.specify
    prompt: 基于更新的宪法实现功能规格。我想构建...
---

## 用户输入

```text
$ARGUMENTS
```

在继续之前，你**必须**考虑用户输入（如果不为空）。

## 执行前检查

**检查扩展钩子（宪法更新之前）**：
- 检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.before_constitution` 键下的条目
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

你正在更新位于 `.specify/memory/constitution.md` 的项目宪法。该文件是一个模板，包含方括号形式的占位符 token（例如 `[PROJECT_NAME]`、`[PRINCIPLE_1_NAME]`）。你的工作是 (a) 收集/推导具体值，(b) 精确填充模板，以及 (c) 将任何修改传播到所有依赖产物。

**注意**：如果 `.specify/memory/constitution.md` 尚不存在，它应该在项目设置期间从 `.specify/templates/constitution-template.md` 初始化。如果缺失，请先复制模板。

遵循此执行流程：

1. 加载位于 `.specify/memory/constitution.md` 的现有宪法。
   - 识别每个形式为 `[ALL_CAPS_IDENTIFIER]` 的占位符 token。
   - **重要**：用户可能需要比模板中使用更多或更少的原则。如果指定了数字，请尊重该数字——遵循通用模板。你将相应地更新文档。

2. 收集/推导占位符的值：
   - 如果用户输入（对话）提供了值，则使用它。
   - 否则从现有仓库上下文推断（README、docs、之前的宪法版本（如果嵌入））。
   - 对于治理日期：`RATIFICATION_DATE` 是原始采用日期（如果未知则询问或标记 TODO），`LAST_AMENDED_DATE` 是今天（如果做了更改），否则保留之前的值。
   - `CONSTITUTION_VERSION` 必须按照语义版本规则递增：
     - MAJOR：向后不兼容的治理/原则删除或重新定义。
     - MINOR：新增原则/章节或实质性扩展指导内容。
     - PATCH：澄清、措辞、拼写修复、非语义优化。
   - 如果版本升级类型不明确，在最终确定前提出理由。

3. 起草更新后的宪法内容：
   - 用具体文本替换每个占位符（除了项目有意选择尚未定义而故意保留的模板槽位外，不应留下方括号 token——对任何保留的需明确说明理由）。
   - 保留标题层级；注释可在替换后删除，除非仍能提供澄清指导。
   - 确保每个原则部分：简洁的名称行、段落（或要点列表）捕获不可协商的规则、非显而易见时的明确理由。
   - 确保治理部分列出修订程序、版本策略和合规审查期望。

4. 一致性传播清单（将之前的清单转换为主动验证）：
   - 读取 `.specify/templates/plan-template.md` 并确保任何 "Constitution Check" 或规则与更新后的原则一致。
   - 读取 `.specify/templates/spec-template.md` 进行范围/需求一致性检查——如果宪法添加/删除了必填章节或约束则更新。
   - 读取 `.specify/templates/tasks-template.md` 并确保任务分类反映新增或删除的原则驱动任务类型（例如可观测性、版本控制、测试规范）。
   - 读取 `.specify/templates/commands/*.md` 中的每个命令文件（包括本文件）以验证当需要通用指导时没有遗留过时引用（如仅限 CLAUDE 等 agent 特定名称）。
   - 读取任何运行时指导文档（例如 `README.md`、`docs/quickstart.md` 或存在的 agent 特定指导文件）。更新对已变更原则的引用。

5. 生成同步影响报告（作为 HTML 注释追加到更新后宪法文件顶部）：
   - 版本变更：旧 → 新
   - 修改的原则列表（如重命名则为旧标题 → 新标题）
   - 新增章节
   - 删除章节
   - 需要更新的模板（✅ 已更新 / ⚠ 待处理）附带文件路径
   - 如有任何占位符被有意延后的待办事项

6. 最终输出前的验证：
   - 无残留未解释的方括号 token。
   - 版本行与报告一致。
   - 日期 ISO 格式 YYYY-MM-DD。
   - 原则是声明性的、可测试的，不含模糊措辞（"should" → 在适当位置替换为 MUST/SHOULD 及理由）。

7. 将完成的宪法写回 `.specify/memory/constitution.md`（覆盖）。

8. 向用户输出最终摘要，包括：
   - 新版本及升级理由。
   - 任何标记为手动跟进的文件。
   - 建议的提交消息（例如 `docs: amend constitution to vX.Y.Z (principle additions + governance update)`）。

格式与样式要求：

- 使用与模板完全一致的 Markdown 标题（不要提升或降低级别）。
- 将较长的理由行换行以保持可读性（理想情况下 <100 字符），但不要强制使用尴尬的断行。
- 各章节之间保留一个空行。
- 避免尾部空白字符。

如果用户提供部分更新（例如仅一个原则修订），仍需执行验证和版本决策步骤。

如果缺少关键信息（例如批准日期确实未知），插入 `TODO(<字段名>): 解释说明` 并将其包含在同步影响报告的延后项目中。

不要创建新模板；始终操作现有的 `.specify/memory/constitution.md` 文件。

## 执行后检查

**检查扩展钩子（宪法更新之后）**：
检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.after_constitution` 键下的条目
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
    EXECUTE_COMMAND: {command}`
    ```
- 如果没有注册任何钩子或 `.specify/extensions.yml` 不存在，则静默跳过
