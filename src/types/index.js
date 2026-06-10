/**
 * Workflow 管理系统 — 类型定义（JSDoc）
 *
 * 核心实体：
 *   StepDefinition — 步骤类型模板（定义 config schema）
 *   Workflow       — 工作流（由 Step 节点 + 连线组成）
 *   Dict           — 字典数据表（结构 + 数据行）
 *   WorkflowInstance — 工作流实例（执行产生的 case）
 */

/**
 * @typedef {'fixed'|'list'|'dict'} ConfigValueType
 * 配置字段的值来源类型：
 *   fixed — 固定值（用户直接输入或从选项中选择）
 *   list  — 固定列表（用户输入多个值）
 *   dict  — 引用字典数据（从某个 Dict 的列中选取值）
 */

/**
 * @typedef {Object} ConfigField
 * @property {string} name         - 字段标识（如 "approver", "url"）
 * @property {string} label        - 字段显示名（如 "审批人", "请求地址"）
 * @property {ConfigValueType} valueType - 值来源类型
 * @property {'string'|'number'|'boolean'} [dataType] - fixed 时的数据类型
 * @property {string[]} [options]  - fixed 时的预定义选项列表
 * @property {string} [dictId]     - dict 类型时引用的字典 ID
 * @property {string} [dictColumn] - dict 类型时显示/使用的列名
 * @property {boolean} [required]  - 是否必填（默认 false）
 * @property {string} [placeholder] - 输入提示文本
 */

/**
 * @typedef {Object} StepDefinition
 * @property {string} id
 * @property {string} name         - 步骤名称（如 "HTTP 请求"）
 * @property {string} description
 * @property {string} category     - 分类标签（如 "HTTP", "审批", "通知", "脚本", "数据处理"）
 * @property {ConfigField[]} configSchema - 配置字段定义列表
 * @property {string} createdAt
 */

/**
 * @typedef {Object} WorkflowNode
 * @property {string} id           - 节点唯一标识
 * @property {string} stepDefId    - 引用的 StepDefinition.id
 * @property {string} label        - 显示标签
 * @property {Object.<string, any>} config - 各配置字段的值 { [fieldName]: configValue }
 * @property {{x: number, y: number}} position - 画布位置
 */

/**
 * @typedef {Object} WorkflowEdge
 * @property {string} id
 * @property {string} source       - 源节点 ID
 * @property {string} target       - 目标节点 ID
 * @property {string} [sourceHandle]
 * @property {string} [targetHandle]
 */

/**
 * @typedef {Object} Workflow
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {WorkflowNode[]} nodes
 * @property {WorkflowEdge[]} edges
 * @property {'draft'|'published'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} DictColumn
 * @property {string} name         - 字段标识
 * @property {string} label        - 显示名
 * @property {'string'|'number'} type
 */

/**
 * @typedef {Object} Dict
 * @property {string} id
 * @property {string} name         - 如 "用户表"
 * @property {string} description
 * @property {DictColumn[]} columns
 * @property {Array<Object.<string, any>>} rows
 */

/**
 * @typedef {'pending'|'running'|'done'|'failed'} StepNodeStatus
 */

/**
 * @typedef {Object} InstanceNodeState
 * @property {string} nodeId       - 对应 WorkflowNode.id
 * @property {StepNodeStatus} status
 * @property {Object} [result]     - 步骤执行结果
 */

/**
 * @typedef {Object} WorkflowInstance
 * @property {string} id
 * @property {string} workflowId
 * @property {string} workflowName
 * @property {'running'|'completed'|'failed'|'cancelled'} status
 * @property {InstanceNodeState[]} nodeStates
 * @property {string} createdAt
 * @property {string} [completedAt]
 */

export {};
