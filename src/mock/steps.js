import { generateId, now } from '../utils/id';

/**
 * 预置步骤类型数据
 * 覆盖不同分类：HTTP、审批、通知、脚本、数据处理
 */

/** @type {import('../types').StepDefinition[]} */
const presetSteps = [
  {
    id: 'step-http-req',
    name: 'HTTP 请求',
    description: '发送 HTTP 请求到指定地址，支持多种请求方法',
    category: 'HTTP',
    configSchema: [
      {
        name: 'url',
        label: '请求地址',
        valueType: 'fixed',
        dataType: 'string',
        required: true,
        placeholder: 'https://api.example.com/endpoint',
      },
      {
        name: 'method',
        label: '请求方法',
        valueType: 'fixed',
        dataType: 'string',
        options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        required: true,
      },
      {
        name: 'headers',
        label: '请求头',
        valueType: 'list',
        dataType: 'string',
        placeholder: 'Content-Type: application/json',
      },
      {
        name: 'timeout',
        label: '超时时间(秒)',
        valueType: 'fixed',
        dataType: 'number',
        required: true,
      },
    ],
    createdAt: '2025-06-01 10:00:00',
  },
  {
    id: 'step-approval',
    name: '审批节点',
    description: '将任务发送给指定审批人进行审批',
    category: '审批',
    configSchema: [
      {
        name: 'approver',
        label: '审批人',
        valueType: 'dict',
        dictId: 'dict-users',
        dictColumn: 'name',
        required: true,
      },
      {
        name: 'timeout',
        label: '审批超时(小时)',
        valueType: 'fixed',
        dataType: 'number',
        required: true,
      },
      {
        name: 'notifyType',
        label: '通知方式',
        valueType: 'fixed',
        dataType: 'string',
        options: ['企业微信', '邮件', '短信', '站内通知'],
        required: true,
      },
      {
        name: 'ccUsers',
        label: '抄送人',
        valueType: 'dict',
        dictId: 'dict-users',
        dictColumn: 'name',
      },
    ],
    createdAt: '2025-06-02 14:30:00',
  },
  {
    id: 'step-notify',
    name: '发送通知',
    description: '向指定用户或群组发送消息通知',
    category: '通知',
    configSchema: [
      {
        name: 'channel',
        label: '通知渠道',
        valueType: 'fixed',
        dataType: 'string',
        options: ['企业微信', '邮件', '短信', '钉钉', '飞书'],
        required: true,
      },
      {
        name: 'recipients',
        label: '接收人',
        valueType: 'dict',
        dictId: 'dict-users',
        dictColumn: 'name',
        required: true,
      },
      {
        name: 'templateId',
        label: '消息模板',
        valueType: 'fixed',
        dataType: 'string',
        options: ['审批通知模板', '告警通知模板', '提醒通知模板'],
        required: true,
      },
    ],
    createdAt: '2025-06-03 09:00:00',
  },
  {
    id: 'step-script',
    name: '脚本执行',
    description: '在指定环境执行 Shell 或 Python 脚本',
    category: '脚本',
    configSchema: [
      {
        name: 'scriptType',
        label: '脚本类型',
        valueType: 'fixed',
        dataType: 'string',
        options: ['Shell', 'Python', 'Node.js'],
        required: true,
      },
      {
        name: 'environment',
        label: '执行环境',
        valueType: 'dict',
        dictId: 'dict-environments',
        dictColumn: 'name',
        required: true,
      },
      {
        name: 'scriptContent',
        label: '脚本内容',
        valueType: 'fixed',
        dataType: 'string',
        required: true,
        placeholder: 'echo "hello world"',
      },
      {
        name: 'args',
        label: '脚本参数',
        valueType: 'list',
        dataType: 'string',
        placeholder: '--env prod',
      },
    ],
    createdAt: '2025-06-03 11:00:00',
  },
  {
    id: 'step-data-transform',
    name: '数据转换',
    description: '对数据进行格式转换、字段映射、清洗等操作',
    category: '数据处理',
    configSchema: [
      {
        name: 'transformType',
        label: '转换类型',
        valueType: 'fixed',
        dataType: 'string',
        options: ['JSON → XML', 'CSV → JSON', '字段映射', '数据清洗', '自定义'],
        required: true,
      },
      {
        name: 'sourceField',
        label: '源字段',
        valueType: 'fixed',
        dataType: 'string',
        required: true,
      },
      {
        name: 'targetField',
        label: '目标字段',
        valueType: 'fixed',
        dataType: 'string',
        required: true,
      },
      {
        name: 'mappingRules',
        label: '映射规则',
        valueType: 'list',
        dataType: 'string',
        placeholder: 'field_a→field_b',
      },
    ],
    createdAt: '2025-06-04 16:00:00',
  },
  {
    id: 'step-condition',
    name: '条件判断',
    description: '根据条件判断工作流走向，支持多分支',
    category: '流程控制',
    configSchema: [
      {
        name: 'field',
        label: '判断字段',
        valueType: 'fixed',
        dataType: 'string',
        required: true,
      },
      {
        name: 'operator',
        label: '运算符',
        valueType: 'fixed',
        dataType: 'string',
        options: ['等于', '不等于', '大于', '小于', '包含', '不包含', '为空', '不为空'],
        required: true,
      },
      {
        name: 'compareValue',
        label: '比较值',
        valueType: 'fixed',
        dataType: 'string',
      },
    ],
    createdAt: '2025-06-05 08:30:00',
  },
];

export default presetSteps;
