# [PROJECT_NAME] 规范
<!-- 例如：Spec 规范、TaskFlow 规范等 -->

## 核心原则

### [PRINCIPLE_1_NAME]
<!-- 例如：I. 库优先 -->
[PRINCIPLE_1_DESCRIPTION]
<!-- 例如：每个功能都以独立库的形式起步；库必须是自包含的、可独立测试的、有文档的；必须有明确的用途 — 不允许仅出于组织目的而存在的库 -->

### [PRINCIPLE_2_NAME]
<!-- 例如：II. CLI 接口 -->
[PRINCIPLE_2_DESCRIPTION]
<!-- 例如：每个库通过 CLI 暴露功能；文本输入/输出协议：stdin/args → stdout，错误 → stderr；支持 JSON + 人类可读格式 -->

### [PRINCIPLE_3_NAME]
<!-- 例如：III. 测试优先（不可协商） -->
[PRINCIPLE_3_DESCRIPTION]
<!-- 例如：TDD 强制要求：编写测试 → 用户确认 → 测试失败 → 然后实现；严格执行红-绿-重构循环 -->

### [PRINCIPLE_4_NAME]
<!-- 例如：IV. 集成测试 -->
[PRINCIPLE_4_DESCRIPTION]
<!-- 例如：需要集成测试的重点领域：新库契约测试、契约变更、服务间通信、共享 schema -->

### [PRINCIPLE_5_NAME]
<!-- 例如：V. 可观测性、VI. 版本控制与破坏性变更、VII. 简洁性 -->
[PRINCIPLE_5_DESCRIPTION]
<!-- 例如：文本 I/O 确保可调试性；要求结构化日志；或：MAJOR.MINOR.BUILD 格式；或：保持简单，遵循 YAGNI 原则 -->

## [SECTION_2_NAME]
<!-- 例如：额外约束、安全要求、性能标准等 -->

[SECTION_2_CONTENT]
<!-- 例如：技术栈要求、合规标准、部署策略等 -->

## [SECTION_3_NAME]
<!-- 例如：开发工作流、评审流程、质量门禁等 -->

[SECTION_3_CONTENT]
<!-- 例如：代码评审要求、测试门禁、部署审批流程等 -->

## 治理
<!-- 例如：规范优先于所有其他实践；修订需要文档记录、审批、迁移计划 -->

[GOVERNANCE_RULES]
<!-- 例如：所有 PR/评审必须验证合规性；复杂度必须经过论证；使用 [GUIDANCE_FILE] 获取运行时开发指导 -->

**版本**：[CONSTITUTION_VERSION] | **批准日期**：[RATIFICATION_DATE] | **最后修订**：[LAST_AMENDED_DATE]
<!-- 例如：版本：2.1.1 | 批准日期：2025-06-13 | 最后修订：2025-07-16 -->
