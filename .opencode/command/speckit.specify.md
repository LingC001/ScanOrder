---
description: 根据自然语言功能描述创建或更新功能规格说明。
handoffs: 
  - label: 构建技术方案
    agent: speckit.plan
    prompt: 为规格创建方案。我正在使用...
  - label: 澄清规格需求
    agent: speckit.clarify
    prompt: 澄清规格需求
    send: true
---

## 用户输入

```text
$ARGUMENTS
```

在继续之前，你**必须**考虑用户输入（如果不为空）。

## 执行前检查

**检查扩展钩子（规格之前）**：
- 检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.before_specify` 键下的条目
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

用户在触发消息中 `/speckit.specify` 之后输入的文本**就是**功能描述。假设你在本次对话中始终可以获取它，即使下面 `$ARGUMENTS` 以字面形式出现。除非用户提供了空命令，否则不要要求用户重复输入。

基于该功能描述，执行以下操作：

1. **生成一个简洁的短名称**（2-4 个词）用于该功能：
   - 分析功能描述并提取最有意义的关键词
   - 创建一个 2-4 个词的短名称来捕捉功能本质
   - 尽可能使用"动作-名词"格式（例如 "add-user-auth"、"fix-payment-bug"）
   - 保留技术术语和缩写（OAuth2、API、JWT 等）
   - 保持简洁但足够描述性，以便一目了然地理解功能
   - 示例：
     - "I want to add user authentication" → "user-auth"
     - "Implement OAuth2 integration for the API" → "oauth2-api-integration"
     - "Create a dashboard for analytics" → "analytics-dashboard"
     - "Fix payment processing timeout bug" → "fix-payment-timeout"

2. **分支创建**（可选，通过钩子）：

   如果 `before_specify` 钩子在上述执行前检查中成功运行，它将已经创建/切换到一个 git 分支并输出包含 `BRANCH_NAME` 和 `FEATURE_NUM` 的 JSON。记录这些值以供参考，但分支名**不**决定规格目录名称。

   如果用户明确提供了 `GIT_BRANCH_NAME`，将其传递给钩子，以便分支脚本使用确切值作为分支名称（绕过所有前缀/后缀生成）。

3. **创建规格功能目录**：

   规格默认位于 `specs/` 目录下，除非用户明确提供了 `SPECIFY_FEATURE_DIRECTORY`。

   **`SPECIFY_FEATURE_DIRECTORY` 的解析顺序**：
   1. 如果用户明确提供了 `SPECIFY_FEATURE_DIRECTORY`（例如通过环境变量、参数或配置），按原样使用
   2. 否则在 `specs/` 下自动生成：
      - 检查 `.specify/init-options.json` 中的 `branch_numbering`
      - 如果是 `"timestamp"`：前缀为 `YYYYMMDD-HHMMSS`（当前时间戳）
      - 如果是 `"sequential"` 或不存在：前缀为 `NNN`（扫描 `specs/` 中现有目录后的下一个可用 3 位数字）
      - 构造目录名：`<prefix>-<short-name>`（例如 `003-user-auth` 或 `20260319-143022-user-auth`）
      - 将 `SPECIFY_FEATURE_DIRECTORY` 设置为 `specs/<directory-name>`

   **创建目录和规格文件**：
   - `mkdir -p SPECIFY_FEATURE_DIRECTORY`
   - 将 `.specify/templates/spec-template.md` 复制到 `SPECIFY_FEATURE_DIRECTORY/spec.md` 作为起点
   - 将 `SPEC_FILE` 设置为 `SPECIFY_FEATURE_DIRECTORY/spec.md`
   - 将解析后的路径持久化到 `.specify/feature.json`：
     ```json
     {
       "feature_directory": "<resolved feature dir>"
     }
     ```
     写入实际解析后的目录路径值（例如 `specs/003-user-auth`），而不是字面字符串 `SPECIFY_FEATURE_DIRECTORY`。
     这允许下游命令（`/speckit.plan`、`/speckit.tasks` 等）在不依赖 git 分支命名约定的情况下定位功能目录。

   **重要提示**：
   - 每次 `/speckit.specify` 调用只能创建一个功能
   - 规格目录名和 git 分支名是独立的——它们可以相同，但这取决于用户的选择
   - 规格目录和文件始终由此命令创建，从不由钩子创建

4. 加载 `.specify/templates/spec-template.md` 以了解必需的章节。

5. 遵循此执行流程：
   1. 从参数解析用户描述
      如果为空：错误 "未提供功能描述"
   2. 从描述中提取关键概念
      识别：参与者、动作、数据、约束条件
   3. 对于不明确的方面：
      - 基于上下文和行业标准做出有根据的猜测
      - 仅在以下情况标记 `[NEEDS CLARIFICATION: 具体问题]`：
        - 该选择显著影响功能范围或用户体验
        - 存在多种合理解读且含义不同
        - 不存在合理的默认值
      - **限制：最多 3 个 [NEEDS CLARIFICATION] 标记**
      - 按影响优先级排序澄清：范围 > 安全/隐私 > 用户体验 > 技术细节
   4. 填写用户场景与测试部分
      如果没有清晰的用户流程：错误 "无法确定用户场景"
   5. 生成功能需求
      每个需求必须可测试
      对未指定的细节使用合理的默认值（在假设部分记录假设）
   6. 定义成功标准
      创建可衡量的、与技术无关的结果
      包含定量指标（时间、性能、数量）和定性度量（用户满意度、任务完成率）
      每个标准必须无需实现细节即可验证
   7. 识别关键实体（如果涉及数据）
   8. 返回：SUCCESS（规格已准备好进入规划阶段）

6. 使用模板结构将规格写入 SPEC_FILE，用从功能描述（参数）派生的具体细节替换占位符，同时保持章节顺序和标题不变。

7. **规格质量验证**：写入初始规格后，对照质量标准进行验证：

   a. **创建规格质量清单**：使用清单模板结构在 `SPECIFY_FEATURE_DIRECTORY/checklists/requirements.md` 生成清单文件，包含以下验证项：

     ```markdown
     # 规格质量清单: [功能名称]
     
     **目的**: 在进入规划阶段前验证规格的完整性和质量
     **创建日期**: [日期]
     **功能**: [链接到 spec.md]
     
     ## 内容质量
     
     - [ ] 无实现细节（语言、框架、API）
     - [ ] 聚焦于用户价值和业务需求
     - [ ] 为非技术利益相关者编写
     - [ ] 所有必填章节已完成
     
     ## 需求完整性
     
     - [ ] 无残留的 [NEEDS CLARIFICATION] 标记
     - [ ] 需求可测试且无歧义
     - [ ] 成功标准可衡量
     - [ ] 成功标准与技术无关（无实现细节）
     - [ ] 所有验收场景已定义
     - [ ] 边界情况已识别
     - [ ] 范围边界明确
     - [ ] 依赖关系和假设已识别
     
     ## 功能就绪状态
     
     - [ ] 所有功能需求都有清晰的验收标准
     - [ ] 用户场景覆盖主要流程
     - [ ] 功能满足成功标准中定义的可衡量结果
     - [ ] 无实现细节泄漏到规格中
     
     ## 备注
     
     - 标记为未完成的项需要在 `/speckit.clarify` 或 `/speckit.plan` 之前更新规格
     ```

   b. **运行验证检查**：对照每个清单项审查规格：
      - 对于每项，确定通过还是失败
      - 记录发现的具体问题（引用相关规格章节）

   c. **处理验证结果**：

      - **如果所有项都通过**：标记清单完成并继续步骤 8

      - **如果有项失败（不包括 [NEEDS CLARIFICATION]）**：
        1. 列出失败项和具体问题
        2. 更新规格以解决每个问题
        3. 重新运行验证直到所有项通过（最多 3 次迭代）
        4. 如果 3 次迭代后仍然失败，在清单备注中记录剩余问题并警告用户

      - **如果仍有 [NEEDS CLARIFICATION] 标记**：
        1. 从规格中提取所有 `[NEEDS CLARIFICATION: ...]` 标记
        2. **限制检查**：如果超过 3 个标记，仅保留最重要的 3 个（按范围/安全/UX 影响），对其余部分做出有根据的猜测
        3. 对于每个需要的澄清（最多 3 个），按以下格式向用户展示选项：

           ```markdown
           ## 问题 [N]: [主题]
           
           **上下文**: [引用相关规格章节]
           
           **我们需要了解**: [来自 NEEDS CLARIFICATION 标记的具体问题]
           
           **建议答案**:
           
           | 选项 | 答案 | 影响 |
           |--------|--------|--------------|
           | A      | [第一个建议答案] | [这对功能意味着什么] |
           | B      | [第二个建议答案] | [这对功能意味着什么] |
           | C      | [第三个建议答案] | [这对功能意味着什么] |
           | 自定义 | 提供你自己的答案 | [如何提供自定义输入] |
           
           **你的选择**: _[等待用户回复]_
           ```

        4. **关键 - 表格格式化**：确保 markdown 表格格式正确：
           - 使用一致的间距并对齐管道符
           - 每个单元格内容周围应有空格：`| Content |` 而不是 `|Content|`
           - 表头分隔符必须至少有 3 个破折号：`|--------|`
           - 测试表格在 markdown 预览中正确渲染
        5. 按顺序编号问题（Q1、Q2、Q3 - 最多共 3 个）
        6. 在等待回复之前一次性展示所有问题
        7. 等待用户对所有问题的选择进行回复（例如 "Q1: A, Q2: Custom - [详情], Q3: B"）
        8. 通过用用户选择的或提供的答案替换每个 `[NEEDS CLARIFICATION]` 标记来更新规格
        9. 所有澄清解决后重新运行验证

   d. **更新清单**：每次验证迭代后，更新清单文件的当前通过/失败状态

8. **向用户报告完成情况**，包括：
   - `SPECIFY_FEATURE_DIRECTORY` — 功能目录路径
   - `SPEC_FILE` — 规格文件路径
   - 清单结果摘要
   - 下一阶段的就绪状态（`/speckit.clarify` 或 `/speckit.plan`）

9. **检查扩展钩子**：报告完成后，检查项目根目录下是否存在 `.specify/extensions.yml`。
   - 如果存在，读取它并查找 `hooks.after_specify` 键下的条目
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

**注意：** 分支创建由 `before_specify` 钩子（git 扩展）处理。规格目录和文件始终由此核心命令创建。

## 快速指南

- 聚焦于用户需要**什么**以及**为什么**。
- 避免如何实现（不涉及技术栈、API、代码结构）。
- 为业务利益相关者编写，而非开发者。
- 不要创建嵌入规格中的清单。那将是单独的命令。

### 章节要求

- **必填章节**：每个功能都必须完成
- **可选章节**：仅在与功能相关时包含
- 当某章节不适用时，完全移除它（不要留作 "N/A"）

### AI 生成指引

当从用户提示创建此规格时：

1. **做出有根据的猜测**：使用上下文、行业标准和常见模式填补空白
2. **记录假设**：在假设部分记录合理的默认值
3. **限制澄清**：最多 3 个 [NEEDS CLARIFICATION] 标记——仅用于以下关键决策：
   - 显著影响功能范围或用户体验
   - 存在多种合理解读且含义不同
   - 缺乏任何合理的默认值
4. **优先级排序**：范围 > 安全/隐私 > 用户体验 > 技术细节
5. **像测试人员一样思考**：每个模糊的需求都应该无法通过"可测试且无歧义"的清单项
6. **常见需要澄清的领域**（仅当不存在合理默认值时）：
   - 功能范围和边界（包含/排除特定用例）
   - 用户类型和权限（如果存在多种冲突的解读可能）
   - 安全/合规要求（当具有法律/财务重要性时）

**合理默认值的示例**（不需要询问这些）：

- 数据保留：该领域的行业标准实践
- 性能目标：标准的 Web/移动应用预期，除非另有指定
- 错误处理：带有适当回退的用户友好消息
- 认证方式：Web 应用使用标准会话认证或 OAuth2
- 集成模式：使用项目适用的模式（Web 服务使用 REST/GraphQL，库使用函数调用，工具使用 CLI 参数等）

### 成功标准指南

成功标准必须满足：

1. **可衡量**：包含具体指标（时间、百分比、数量、比率）
2. **与技术无关**：不提及框架、语言、数据库或工具
3. **以用户为中心**：从用户/业务角度描述结果，而非系统内部
4. **可验证**：无需了解实现细节即可测试/验证

**好的示例**：

- "Users can complete checkout in under 3 minutes"
- "System supports 10,000 concurrent users"
- "95% of searches return results in under 1 second"
- "Task completion rate improves by 40%"

**不好的示例**（聚焦实现）：

- "API response time is under 200ms"（过于技术化，应使用 "Users see results instantly"）
- "Database can handle 1000 TPS"（实现细节，应使用面向用户的指标）
- "React components render efficiently"（特定框架）
- "Redis cache hit rate above 80%"（特定技术）
