---
description: 在任务生成后对 spec.md、plan.md 和 tasks.md 执行非破坏性的跨产物一致性与质量分析。
---

## 用户输入

```text
$ARGUMENTS
```

在继续之前，你**必须**考虑用户输入（如果不为空）。

## 执行前检查

**检查扩展钩子（分析之前）**：
- 检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.before_analyze` 键下的条目
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

    在继续到目标之前等待钩子命令的结果。
    ```
- 如果没有注册任何钩子或 `.specify/extensions.yml` 不存在，则静默跳过

## 目标

在实施之前识别三个核心产物（`spec.md`、`plan.md`、`tasks.md`）之间的不一致、重复、模糊性和描述不足的条目。此命令**必须**在 `/speckit.tasks` 成功产生完整的 `tasks.md` 之后才能运行。

## 操作约束

**严格只读**：**不要**修改任何文件。输出结构化分析报告。提供可选的补救计划（用户必须明确批准后才会手动调用后续编辑命令）。

**宪法权威性**：项目宪法（`.specify/memory/constitution.md`）在此分析范围内是**不可协商的**。宪法冲突自动为 CRITICAL 级别，需要对 spec、plan 或 tasks 进行调整——而非淡化、重新解读或静默忽略原则。如果原则本身需要变更，必须在 `/speckit.analyze` 之外通过单独、明确的宪法更新来完成。

## 执行步骤

### 1. 初始化分析上下文

从仓库根目录运行一次 `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks` 并解析 JSON 获取 FEATURE_DIR 和 AVAILABLE_DOCS。推导绝对路径：

- SPEC = FEATURE_DIR/spec.md
- PLAN = FEATURE_DIR/plan.md
- TASKS = FEATURE_DIR/tasks.md

如果任何必需文件缺失则以错误消息中止（指示用户运行缺失的前置命令）。
对于参数中类似 "I'm Groot" 的单引号，使用转义语法：例如 'I'\''m Groot'（如果可能的话使用双引号："I'm Groot"）。

### 2. 加载产物（渐进式披露）

仅从每个产物加载最少的必要上下文：

**来自 spec.md：**

- 概览/上下文
- 功能需求
- 成功标准（可衡量的结果——例如性能、安全性、可用性、用户成功、业务影响）
- 用户故事
- 边界情况（如存在）

**来自 plan.md：**

- 架构/技术栈选择
- 数据模型引用
- 阶段
- 技术约束

**来自 tasks.md：**

- 任务 ID
- 描述
- 阶段分组
- 并行标记 [P]
- 引用的文件路径

**来自宪法：**

- 加载 `.specify/memory/constitution.md` 用于原则验证

### 3. 构建语义模型

创建内部表示（不在输出中包含原始产物）：

- **需求清单**：对于每个功能需求（FR-###）和成功标准（SC-###），记录一个稳定键。使用显式的 FR-/SC- 标识符作为主键（当存在时），并可选择性派生一个命令式短语 slug 以提高可读性（例如 "User can upload file" → `user-can-upload-file`）。仅包含需要构建工作的成功标准项（例如负载测试基础设施、安全审计工具），排除发布后结果指标和业务 KPI（例如 "Reduce support tickets by 50%"）。
- **用户故事/动作清单**：带有验收标准的离散用户动作
- **任务覆盖映射**：将每个任务映射到一个或多个需求或故事（通过关键词推断 / 显式引用模式如 ID 或关键词）
- **宪法规则集**：提取原则名称和 MUST/SHOULD 规范性语句

### 4. 检测过程（Token 高效分析）

聚焦高价值发现。限制总共 50 条发现；其余在溢出摘要中聚合。

#### A. 重复检测

- 识别近似重复的需求
- 标记较低质量的措辞以待合并

#### B. 模糊性检测

- 标记缺乏可衡量标准的模糊形容词（fast、scalable、secure、intuitive、robust）
- 标记未解决的占位符（TODO、TKTK、???、`<placeholder>` 等）

#### C. 描述不足

- 有动词但缺少对象或可衡量结果的需求
- 缺少验收标准对齐的用户故事
- 引用了 spec/plan 中未定义的文件或组件的任务

#### D. 宪法一致性

- 与 MUST 原则冲突的任何需求或 plan 元素
- 宪法要求的缺失章节或质量门控

#### E. 覆盖缺口

- 零关联任务的需求
- 无映射需求/故事的任务
- 需要构建工作（性能、安全性、可用性）的成功标准未反映在任务中

#### F. 不一致性

- 术语漂移（同一概念在不同文件中命名不同）
- plan 中引用但 spec 中缺失的数据实体（反之亦然）
- 任务排序矛盾（例如集成任务在基础设置任务之前且无依赖说明）
- 冲突的需求（例如一个要求 Next.js 另一个指定 Vue）

### 5. 严重程度分配

使用此启发式方法对发现进行优先级排序：

- **CRITICAL**：违反宪法 MUST、缺失核心 spec 产物、或零覆盖的需求阻塞基线功能
- **HIGH**：重复或冲突的需求、模糊的安全/性能属性、不可测试的验收标准
- **MEDIUM**：术语漂移、缺失的非功能任务覆盖、描述不足的边界情况
- **LOW**：风格/措辞改进、不影响执行顺序的轻微冗余

### 6. 生成紧凑分析报告

输出 Markdown 报告（不写入文件），包含以下结构：

## Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| A1 | Duplication | HIGH | spec.md:L120-134 | Two similar requirements ... | Merge phrasing; keep clearer version |

（每条发现添加一行；生成以类别首字母为前缀的稳定 ID。）

**覆盖度汇总表：**

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|

**宪法一致性问题：**（如有）

**未映射的任务：**（如有）

**指标**：

- 总需求数
- 总任务数
- 覆盖率%（有 >=1 任务的需求）
- 模糊性数量
- 重复数量
- 关键问题数量

### 7. 提供下一步行动

在报告末尾，输出简洁的下一步行动块：

- 如果存在 CRITICAL 问题：建议在 `/speckit.implement` 之前解决
- 如果只有 LOW/MEDIUM：用户可以继续，但提供改进建议
- 提供明确的命令建议：例如 "Run /speckit.specify with refinement"、"Run /speckit.plan to adjust architecture"、"Manually edit tasks.md to add coverage for 'performance-metrics'"

### 8. 提供补救方案

询问用户："Would you like me to suggest concrete remediation edits for the top N issues?"（不要自动应用。）

### 9. 检查扩展钩子

报告完成后，检查项目根目录下是否存在 `.specify/extensions.yml`。
- 如果存在，读取它并查找 `hooks.after_analyze` 键下的条目
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

## 操作原则

### 上下文效率

- **最少高价值 token**：聚焦可操作的发现，而非详尽文档
- **渐进式披露**：增量加载产物；不要将所有内容倾倒入分析
- **Token 高效输出**：限制发现表为 50 行；汇总溢出部分
- **确定性结果**：无变更时重新运行应产生一致的 ID 和计数

### 分析指南

- **永不修改文件**（这是只读分析）
- **永不臆测缺失章节**（如果缺失，准确报告）
- **优先处理宪法违规**（这些始终为 CRITICAL）
- **使用示例而非详尽规则**（引用具体实例，而非通用模式）
- **优雅地报告零问题**（输出带覆盖率统计的成功报告）

## 上下文

$ARGUMENTS
