---
description: 根据用户需求为当前功能生成自定义清单。
---

## 清单用途："针对英文的单元测试"

**核心概念**：清单是**需求编写的单元测试**——它们验证给定领域中需求的质量、清晰度和完整性。

**不用于验证/测试**：

- ❌ 不是 "Verify the button clicks correctly"
- ❌ 不是 "Test error handling works"
- ❌ 不是 "Confirm the API returns 200"
- ❌ 不是检查代码/实现是否与规格匹配

**用于需求质量验证**：

- ✅ "Are visual hierarchy requirements defined for all card types?" (completeness)
- ✅ "Is 'prominent display' quantified with specific sizing/positioning?" (clarity)
- ✅ "Are hover state requirements consistent across all interactive elements?" (consistency)
- ✅ "Are accessibility requirements defined for keyboard navigation?" (coverage)
- ✅ "Does the spec define what happens when logo image fails to load?" (edge cases)

**比喻**：如果你的规格是用英文编写的代码，那么清单就是它的单元测试套件。你测试的是需求是否编写良好、完整、无歧义且准备好实施——而不是实现是否有效。

## 用户输入

```text
$ARGUMENTS
```

在继续之前，你**必须**考虑用户输入（如果不为空）。

## 执行前检查

**检查扩展钩子（清单生成之前）**：
- 检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.before_checklist` 键下的条目
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

    在继续到执行步骤之前等待钩子命令的结果。
    ```
- 如果没有注册任何钩子或 `.specify/extensions.yml` 不存在，则静默跳过

## 执行步骤

1. **初始化设置**：从仓库根目录运行 `.specify/scripts/powershell/check-prerequisites.ps1 -Json` 并解析 JSON 获取 FEATURE_DIR 和 AVAILABLE_DOCS 列表。
   - 所有文件路径必须是绝对路径。
   - 对于参数中类似 "I'm Groot" 的单引号，使用转义语法：例如 'I'\''m Groot'（如果可能的话使用双引号："I'm Groot"）。

2. **澄清意图（动态）**：推导最多三个初始上下文澄清问题（无预置目录）。它们必须：
   - 从用户的表述 + 从 spec/plan/tasks 中提取的信号生成
   - 只询问会实质性改变清单内容的信息
   - 如果在 `$ARGUMENTS` 中已经无歧义则单独跳过
   - 偏好精确而非广泛

   生成算法：
   1. 提取信号：功能领域关键词（例如 auth、latency、UX、API）、风险指标（"critical"、"must"、"compliance"）、利益相关者提示（"QA"、"review"、"security team"）和明确交付物（"a11y"、"rollback"、"contracts"）。
   2. 将信号聚类为候选关注领域（最多 4 个）按相关性排序。
   3. 识别可能的受众和时间（作者、审阅者、QA、发布）（如果未明确）。
   4. 检测缺失维度：范围广度、深度/严格程度、风险强调、排除边界、可衡量验收标准。
   5. 从以下原型中选择问题：
      - 范围细化（例如 "Should this include integration touchpoints with X and Y or stay limited to local module correctness?"）
      - 风险优先级（例如 "Which of these potential risk areas should receive mandatory gating checks?"）
      - 深度校准（例如 "Is this a lightweight pre-commit sanity list or a formal release gate?"）
      - 受众定位（例如 "Will this be used by the author only or peers during PR review?"）
      - 边界排除（例如 "Should we explicitly exclude performance tuning items this round?"）
      - 场景类别缺口（例如 "No recovery flows detected—are rollback / partial failure paths in scope?"）

   问题格式化规则：
   - 如果展示选项，生成紧凑表格，列：Option | Candidate | Why It Matters
   - 限制最多 A–E 选项；如果自由形式答案更清晰则省略表格
   - 不要让用户复述他们已经说过的内容
   - 避免推测性类别（不要臆造）。如果不确定，明确询问："Confirm whether X belongs in scope."

   交互不可用时的默认值：
   - 深度：Standard
   - 受众：Reviewer (PR)（如果与代码相关）；否则 Author
   - 关注点：Top 2 相关性聚类

   输出问题（标记 Q1/Q2/Q3）。回答后：如果 ≥2 个场景类别（Alternate / Exception / Recovery / Non-Functional domain）仍不清楚，你可再问最多两个针对性的追问（Q4/Q5）各附一行理由（例如 "Unresolved recovery path risk"）。总问题数不超过五个。如果用户明确拒绝更多则跳过。

3. **理解用户请求**：结合 `$ARGUMENTS` + 澄清答案：
   - 推导清单主题（例如 security、review、deploy、ux）
   - 整合用户提到的明确必备项
   - 将关注选择映射到类别框架
   - 从 spec/plan/tasks 推断任何缺失上下文（不要臆造）

4. **加载功能上下文**：从 FEATURE_DIR 读取：
   - spec.md：功能需求和范围
   - plan.md（如存在）：技术细节、依赖
   - tasks.md（如存在）：实施任务

   **上下文加载策略**：
   - 仅加载与活跃关注领域相关的必要部分（避免全文件倾倒）
   - 偏好将长章节总结为简洁的场景/需求要点
   - 使用渐进式披露：仅在检测到缺口时才追加检索
   - 如果源文档较大，生成中间摘要项而非嵌入原始文本

5. **生成清单** — 创建"需求的单元测试"：
   - 如果 `FEATURE_DIR/checklists/` 目录不存在则创建
   - 生成唯一的清单文件名：
     - 使用基于领域的简短描述性名称（例如 `ux.md`、`api.md`、`security.md`）
     - 格式：`[domain].md`
   - 文件处理行为：
     - 如果文件**不存在**：创建新文件，编号从 CHK001 开始
     - 如果文件**存在**：向现有文件追加新项，从最后一个 CHK ID 继续（例如最后一项是 CHK015，新项从 CHK016 开始）
   - 永远不删除或替换现有清单内容——始终保留并追加

   **核心原则 - 测试需求，而非实现**：
   每个清单项必须对**需求本身**评估以下方面：
   - **完整性**：所有必要的需求是否存在？
   - **清晰度**：需求是否明确且具体？
   - **一致性**：需求之间是否一致？
   - **可衡量性**：需求能否客观验证？
   - **覆盖度**：所有场景/边界情况是否都已涉及？

   **类别结构** — 按需求质量维度分组：
   - **需求完整性**（所有必要需求是否已记录？）
   - **需求清晰度**（需求是否具体且无歧义？）
   - **需求一致性**（需求是否一致且无冲突？）
   - **验收标准质量**（成功标准是否可衡量？）
   - **场景覆盖度**（所有流程/情况是否已涉及？）
   - **边界情况覆盖度**（边界条件是否已定义？）
   - **非功能性需求**（Performance、Security、Accessibility 等——是否已指定？）
   - **依赖与假设**（是否已记录并验证？）
   - **模糊性与冲突**（需要澄清什么？）

   **如何编写清单项 - "针对英文的单元测试"**：

   ❌ **错误**（测试实现）：
   - "Verify landing page displays 3 episode cards"
   - "Test hover states work on desktop"
   - "Confirm logo click navigates home"

   ✅ **正确**（测试需求质量）：
   - "Are the exact number and layout of featured episodes specified?" [Completeness]
   - "Is 'prominent display' quantified with specific sizing/positioning?" [Clarity]
   - "Are hover state requirements consistent across all interactive elements?" [Consistency]
   - "Are keyboard navigation requirements defined for all interactive UI?" [Coverage]
   - "Is the fallback behavior specified when logo image fails to load?" [Edge Cases]
   - "Are loading states defined for asynchronous episode data?" [Completeness]
   - "Does the spec define visual hierarchy for competing UI elements?" [Clarity]

   **项结构**：
   每项应遵循此模式：
   - 询问需求质量的问答格式
   - 关注 spec/plan 中**已写的**（或未写的）内容
   - 在方括号中包含质量维度 [Completeness/Clarity/Consistency 等]
   - 检查已有需求时引用 spec 章节 `[Spec §X.Y]`
   - 检查缺失需求时使用 `[Gap]` 标记

   **按质量维度分类的示例**：

   Completeness:
   - "Are error handling requirements defined for all API failure modes? [Gap]"
   - "Are accessibility requirements specified for all interactive elements? [Completeness]"
   - "Are mobile breakpoint requirements defined for responsive layouts? [Gap]"

   Clarity:
   - "Is 'fast loading' quantified with specific timing thresholds? [Clarity, Spec §NFR-2]"
   - "Are 'related episodes' selection criteria explicitly defined? [Clarity, Spec §FR-5]"
   - "Is 'prominent' defined with measurable visual properties? [Ambiguity, Spec §FR-4]"

   Consistency:
   - "Do navigation requirements align across all pages? [Consistency, Spec §FR-10]"
   - "Are card component requirements consistent between landing and detail pages? [Consistency]"

   Coverage:
   - "Are requirements defined for zero-state scenarios (no episodes)? [Coverage, Edge Case]"
   - "Are concurrent user interaction scenarios addressed? [Coverage, Gap]"
   - "Are requirements specified for partial data loading failures? [Coverage, Exception Flow]"

   Measurability:
   - "Are visual hierarchy requirements measurable/testable? [Acceptance Criteria, Spec §FR-1]"
   - "Can 'balanced visual weight' be objectively verified? [Measurability, Spec §FR-2]"

   **场景分类与覆盖度**（需求质量焦点）：
   - 检查是否存在以下场景的需求：Primary、Alternate、Exception/Error、Recovery、Non-Functional
   - 对于每个场景类别，询问："[场景类型] 需求是否完整、清晰且一致？"
   - 如果场景类别缺失："[场景类型] 需求是有意排除还是遗漏？[Gap]"
   - 当发生状态变更时包含弹性/回滚："Are rollback requirements defined for migration failures? [Gap]"

   **可追溯性要求**：
   - 最低要求：≥80% 的项必须包含至少一个可追溯性引用
   - 每项应引用：spec 章节 `[Spec §X.Y]`，或使用标记：`[Gap]`、`[Ambiguity]`、`[Conflict]`、`[Assumption]`
   - 如果不存在 ID 系统："Is a requirement & acceptance criteria ID scheme established? [Traceability]"

   **发现与解决问题**（需求质量问题）：
   就需求本身提问：
   - 模糊性："Is the term 'fast' quantified with specific metrics? [Ambiguity, Spec §NFR-1]"
   - 冲突："Do navigation requirements conflict between §FR-10 and §FR-10a? [Conflict]"
   - 假设："Is the assumption of 'always available podcast API' validated? [Assumption]"
   - 依赖："Are external podcast API requirements documented? [Dependency, Gap]"
   - 缺失定义："Is 'visual hierarchy' defined with measurable criteria? [Gap]"

   **内容整合**：
   - 软上限：如果原始候选项 > 40，按风险/影响优先级排序
   - 合并几乎重复的检查同一需求方面的项
   - 如果 >5 个低影响边界情况，创建一项："Are edge cases X, Y, Z addressed in requirements? [Coverage]"

   **🚫 绝对禁止** — 这些会使之成为实现测试而非需求测试：
   - ❌ 任何以 "Verify"、"Test"、"Confirm"、"Check" 开头 + 实现行为的项
   - ❌ 引用代码执行、用户操作、系统行为
   - ❌ "Displays correctly"、"works properly"、"functions as expected"
   - ❌ "Click"、"navigate"、"render"、"load"、"execute"
   - ❌ 测试用例、测试计划、QA 流程
   - ❌ 实现细节（框架、API、算法）

   - **✅ 必需模式** — 这些测试需求质量：
   - ✅ "Are [requirement type] defined/specified/documented for [scenario]?"
   - ✅ "Is [vague term] quantified/clarified with specific criteria?"
   - ✅ "Are requirements consistent between [section A] and [section B]?"
   - ✅ "Can [requirement] be objectively measured/verified?"
   - ✅ "Are [edge cases/scenarios] addressed in requirements?"
   - ✅ "Does the spec define [missing aspect]?"

6. **结构参考**：遵循 `.specify/templates/checklist-template.md` 中的规范模板生成清单，包括标题、meta 部分、类别标题和 ID 格式。如果模板不可用，使用：H1 标题、purpose/created meta 行、`##` 类别章节包含 `- [ ] CHK### <requirement item>` 行，ID 从 CHK001 开始全局递增。

7. **报告**：输出清单文件的完整路径、项数，并总结本次运行是创建了新文件还是追加了到现有文件。总结：
   - 选定的关注领域
   - 深度级别
   - 角色/时机
   - 整合的任何用户明确指定的必备项

**重要**：每次 `/speckit.checklist` 命令调用使用简短的描述性清单文件名，要么创建新文件要么追加到现有文件。这允许：

- 多种不同类型的清单（例如 `ux.md`、`test.md`、`security.md`）
- 简单易记的文件名，表明清单用途
- 在 `checklists/` 文件夹中轻松识别和导航

为避免杂乱，使用描述性类型并在完成后清理过时的清单。

## 示例清单类型与示例项

**UX 需求质量：** `ux.md`

示例项（测试需求，**非**实现）：

- "Are visual hierarchy requirements defined with measurable criteria? [Clarity, Spec §FR-1]"
- "Is the number and positioning of UI elements explicitly specified? [Completeness, Spec §FR-1]"
- "Are interaction state requirements (hover, focus, active) consistently defined? [Consistency]"
- "Are accessibility requirements specified for all interactive elements? [Coverage, Gap]"
- "Is fallback behavior defined when images fail to load? [Edge Case, Gap]"
- "Can 'prominent display' be objectively measured? [Measurability, Spec §FR-4]"

**API 需求质量：** `api.md`

示例项：

- "Are error response formats specified for all failure scenarios? [Completeness]"
- "Are rate limiting requirements quantified with specific thresholds? [Clarity]"
- "Are authentication requirements consistent across all endpoints? [Consistency]"
- "Are retry/timeout requirements defined for external dependencies? [Coverage, Gap]"
- "Is versioning strategy documented in requirements? [Gap]"

**性能需求质量：** `performance.md`

示例项：

- "Are performance requirements quantified with specific metrics? [Clarity]"
- "Are performance targets defined for all critical user journeys? [Coverage]"
- "Are performance requirements under different load conditions specified? [Completeness]"
- "Can performance requirements be objectively measured? [Measurability]"
- "Are degradation requirements defined for high-load scenarios? [Edge Case, Gap]"

**安全需求质量：** `security.md`

示例项：

- "Are authentication requirements specified for all protected resources? [Coverage]"
- "Are data protection requirements defined for sensitive information? [Completeness]"
- "Is the threat model documented and requirements aligned to it? [Traceability]"
- "Are security requirements consistent with compliance obligations? [Consistency]"
- "Are security failure/breach response requirements defined? [Gap, Exception Flow]"

## 反例：不该做什么

**❌ 错误 —— 这些测试的是实现，而非需求：**

```markdown
- [ ] CHK001 - Verify landing page displays 3 episode cards [Spec §FR-001]
- [ ] CHK002 - Test hover states work correctly on desktop [Spec §FR-003]
- [ ] CHK003 - Confirm logo click navigates to home page [Spec §FR-010]
- [ ] CHK004 - Check that related episodes section shows 3-5 items [Spec §FR-005]
```

**✅ 正确 —— 这些测试的是需求质量：**

```markdown
- [ ] CHK001 - Are the number and layout of featured episodes explicitly specified? [Completeness, Spec §FR-001]
- [ ] CHK002 - Are hover state requirements consistently defined for all interactive elements? [Consistency, Spec §FR-003]
- [ ] CHK003 - Are navigation requirements clear for all clickable brand elements? [Clarity, Spec §FR-010]
- [ ] CHK004 - Is the selection criteria for related episodes documented? [Gap, Spec §FR-005]
- [ ] CHK005 - Are loading state requirements defined for asynchronous episode data? [Gap]
- [ ] CHK006 - Can "visual hierarchy" requirements be objectively measured? [Measurability, Spec §FR-001]
```

**关键差异**：

- 错误：测试系统是否正常工作
- 正确：测试需求是否编写正确
- 错误：行为的验证
- 正确：需求质量的验证
- 错误："它能做 X 吗？"
- 正确："X 是否被明确定义？"

## 执行后检查

**检查扩展钩子（清单生成之后）**：
检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.after_checklist` 键下的条目
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
