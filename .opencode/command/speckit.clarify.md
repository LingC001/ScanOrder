---
description: 通过提出最多 5 个高度针对性的澄清问题来识别当前功能规格中描述不足的区域，并将答案编码回规格中。
handoffs: 
  - label: 构建技术方案
    agent: speckit.plan
    prompt: 为规格创建方案。我正在使用...
---

## 用户输入

```text
$ARGUMENTS
```

在继续之前，你**必须**考虑用户输入（如果不为空）。

## 执行前检查

**检查扩展钩子（澄清之前）**：
- 检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.before_clarify` 键下的条目
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
    EXECUTE_COMMAND: {command}`

    在继续到大纲之前等待钩子命令的结果。
    ```
- 如果没有注册任何钩子或 `.specify/extensions.yml` 不存在，则静默跳过

## 大纲

目标：检测并减少当前活动功能规格中的模糊性或缺失决策点，并将澄清直接记录在规格文件中。

注意：此澄清工作流预计在调用 `/speckit.plan` 之前运行（并完成）。如果用户明确表示要跳过澄清（例如探索性原型），你可以继续，但必须警告下游返工风险会增加。

执行步骤：

1. 从仓库根目录运行 `.specify/scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly` **一次**（组合 `--json --paths-only` 模式 / `-Json -PathsOnly`）。解析最小 JSON 负载字段：
   - `FEATURE_DIR`
   - `FEATURE_SPEC`
   - （可选捕获 `IMPL_PLAN`、`TASKS` 用于未来的链式流程。）
   - 如果 JSON 解析失败，中止并指示用户重新运行 `/speckit.specify` 或验证功能分支环境。
   - 对于参数中类似 "I'm Groot" 的单引号，使用转义语法：例如 'I'\''m Groot'（如果可能的话使用双引号："I'm Groot"）。

2. 加载当前规格文件。使用此分类法执行结构化的模糊性与覆盖度扫描。对于每个类别，标记状态：Clear / Partial / Missing。生成一个内部覆盖度图用于优先级排序（除非不会提问否则不输出原始图）。

   功能范围与行为：
   - 核心用户目标与成功标准
   - 明确的排除范围声明
   - 用户角色/角色区分

   领域与数据模型：
   - 实体、属性、关系
   - 身份与唯一性规则
   - 生命周期/状态转换
   - 数据量/规模假设

   交互与 UX 流程：
   - 关键用户旅程/序列
   - 错误/空/加载状态
   - 可访问性或本地化说明

   非功能性质量属性：
   - 性能（延迟、吞吐量目标）
   - 可扩展性（水平/垂直、限制）
   - 可靠性与可用性（正常运行时间、恢复期望）
   - 可观测性（日志、指标、追踪信号）
   - 安全与隐私（authN/Z、数据保护、威胁假设）
   - 合规/监管约束（如有）

   集成与外部依赖：
   - 外部服务/API 及故障模式
   - 数据导入/导出格式
   - 协议/版本假设

   边界情况与故障处理：
   - 负面场景
   - 速率限制/节流
   - 冲突解决（例如并发编辑）

   约束与权衡：
   - 技术约束（语言、存储、托管）
   - 明确的权衡或被拒绝的替代方案

   术语与一致性：
   - 规范词汇表术语
   - 避免的同义词/弃用术语

   完成信号：
   - 验收标准可测试性
   - 可衡量的 Definition of Done 风格指标

   杂项/占位符：
   - TODO 标记/未解决的决策
   - 缺少量化的模糊形容词（"robust"、"intuitive"）

   对于每个 Partial 或 Missing 状态的类别，添加候选提问机会，除非：
   - 澄清不会实质性地改变实施或验证策略
   - 信息更适合推迟到规划阶段（内部记录）

3. （内部）生成一个带优先级的候选澄清问题队列（最多 5 个）。不要一次性全部输出。应用以下约束：
   - 整个会话最多 5 个问题。
   - 每个问题必须能用以下任一方式回答：
     - 一个简短的多选题（2–5 个不同的互斥选项），或
     - 一个单词/短语回答（明确限制："Answer in <=5 words"）。
   - 仅包含答案实质性影响架构、数据建模、任务分解、测试设计、UX 行为、运营准备度或合规验证的问题。
   - 确保类别覆盖平衡：尝试首先覆盖最高影响的未解决类别；避免在单个高影响区域（例如安全态势）未解决时问两个低影响问题。
   - 排除已回答的问题、琐碎的风格偏好或规划级别的执行细节（除非阻碍正确性）。
   - 偏好能减少下游返工风险或防止错位验收测试的澄清。
   - 如果超过 5 个类别仍未解决，按（影响 * 不确定性）启发式选择前 5 个。

4. 顺序提问循环（交互式）：
   - 每次**只展示一个问题**。
   - 对于多选题：
      - **分析所有选项**并根据以下确定**最合适的选项**：
         - 项目类型的最佳实践
         - 类似实现中的常见模式
         - 风险降低（安全性、性能、可维护性）
         - 与规格中可见的任何明确项目目标或约束的对齐
      - 在顶部突出展示你的**推荐选项**并附上清晰的理由（1-2 句话解释为何这是最佳选择）。
      - 格式为：`**Recommended:** Option [X] - <reasoning>`
      - 然后将所有选项渲染为 Markdown 表格：

        | Option | Description |
        |--------|-------------|
        | A | <Option A description> |
        | B | <Option B description> |
        | C | <Option C description> (add D/E as needed up to 5) |
        | Short | Provide a different short answer (<=5 words) (Include only if free-form alternative is appropriate) |

      - 表格后添加：`You can reply with the option letter (e.g., "A"), accept the recommendation by saying "yes" or "recommended", or provide your own short answer.`
   - 对于简答风格（无有意义的离散选项）：
      - 根据最佳实践和上下文提供你的**建议答案**。
      - 格式为：`**Suggested:** <your proposed answer> - <brief reasoning>`
      - 然后输出：`Format: Short answer (<=5 words). You can accept the suggestion by saying "yes" or "suggested", or provide your own answer.`
   - 用户回答后：
      - 如果用户回复 "yes"、"recommended" 或 "suggested"，使用你之前陈述的建议/推荐作为答案。
      - 否则，验证答案映射到某个选项或符合 <=5 词限制。
      - 如果有歧义，请求快速澄清（计数仍属于同一问题；不推进）。
      - 一旦满意，将其记录在工作内存中（暂不写入磁盘）并移动到下一个排队的问题。
   - 在以下情况停止进一步提问：
      - 所有关键模糊性提前解决（剩余排队项变得不必要），或
      - 用户发出完成信号（"done"、"good"、"no more"），或
      - 你已达到 5 个提问。
   - 永远不要提前透露未来排队的问题。
   - 如果开始时没有有效问题，立即报告无关键模糊性。

5. 每次接受答案后的集成（增量更新方法）：
   - 维护规格的内存表示（开始时加载一次）加上原始文件内容。
   - 对于本会话的第一个集成答案：
      - 确保存在 `## Clarifications` 章节（如果缺失则在规格模板的最高级上下文/概览章节之后创建）。
      - 在其下，创建（如果不存在）今天的 `### Session YYYY-MM-DD` 子标题。
   - 接受后立即追加一行要点：`- Q: <question> → A: <final answer>`。
   - 然后立即将澄清应用到最适当的章节：
      - 功能模糊性 → 更新或在 Functional Requirements 中添加要点。
      - 用户交互/参与者区分 → 更新 User Stories 或 Actors 子章节（如果存在），补充澄清的角色、约束或场景。
      - 数据形状/实体 → 更新 Data Model（添加字段、类型、关系）保持顺序；简洁记录新增约束。
      - 非功能约束 → 在 Success Criteria > Measurable Outcomes 中添加/修改可衡量标准（将模糊形容词转换为指标或明确目标）。
      - 边界情况/负面流程 → 在 Edge Cases / Error Handling 下添加新要点（或如果模板为此类内容提供占位符则创建此类子章节）。
      - 术语冲突 → 在规格中统一术语；仅在必要时通过一次性添加 `(formerly referred to as "X")` 保留原术语。
   - 如果澄清使早期模糊陈述失效，替换该陈述而非重复；不留过时的矛盾文本。
   - 每次集成后保存规格文件以最小化上下文丢失风险（原子覆盖）。
   - 保留格式：不重排无关章节；保持标题层级完整。
   - 保持每次插入的澄清简洁且可测试（避免叙述性偏移）。

6. 验证（每次写入后加上最终遍历时执行）：
   - Clarifications 会话中每个接受的答案恰好有一个要点（无重复）。
   - 总提问（接受）数 ≤ 5。
   - 更新后的章节不包含新答案应解决的残留模糊占位符。
   - 无残留的矛盾早期陈述（扫描已移除的不再有效的替代选择）。
   - Markdown 结构有效；仅允许的新标题：`## Clarifications`、`### Session YYYY-MM-DD`。
   - 术语一致性：所有更新章节使用相同的规范术语。

7. 将更新后的规格写回 `FEATURE_SPEC`。

8. 报告完成情况（提问循环结束或提前终止后）：
   - 提问与回答的数量。
   - 更新后规格的路径。
   - 涉及的章节（列出名称）。
   - 覆盖度汇总表，列出每个分类法类别及其状态：Resolved（原为 Partial/Missing 且已处理）、Deferred（超出问题配额或更适合规划）、Clear（已经充分）、Outstanding（仍为 Partial/Missing 但低影响）。
   - 如果有任何 Outstanding 或 Deferred 残留，建议是继续 `/speckit.plan` 还是在规划后再次运行 `/speckit.clarify`。
   - 建议的下一步命令。

行为规则：

- 如果未发现有意义的模糊性（或所有潜在问题都是低影响力的），回应："No critical ambiguities detected worth formal clarification." 并建议继续。
- 如果规格文件缺失，指示用户先运行 `/speckit.specify`（不要在此处创建新规格）。
- 总提问数不得超过 5 个（单个问题的澄清重试不计为新问题）。
- 避免推测性技术栈问题，除非其缺失阻碍功能清晰性。
- 尊重用户提前终止信号（"stop"、"done"、"proceed"）。
- 如果因全覆盖而无提问，输出紧凑的覆盖度摘要（所有类别 Clear）然后建议前进。
- 如果达到配额但仍有未解决的高影响力类别，明确在 Deferred 下标注它们并附上理由。

优先级参考上下文：$ARGUMENTS

## 执行后检查

**检查扩展钩子（澄清之后）**：
检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.after_clarify` 键下的条目
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
