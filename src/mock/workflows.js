/** 预置工作流数据 */
/** @type {import('../types').Workflow[]} */
const presetWorkflows = [
  {
    id: 'wf-demo-1',
    name: '请假审批流程',
    description: '员工请假 → 主管审批 → HR 备案的标准化审批流程',
    status: 'published',
    nodes: [
      {
        id: 'node-1',
        stepDefId: 'step-approval',
        label: '主管审批',
        position: { x: 100, y: 150 },
        config: {
          approver: '张三',
          timeout: 48,
          notifyType: '企业微信',
          ccUsers: ['李四'],
        },
      },
      {
        id: 'node-2',
        stepDefId: 'step-notify',
        label: '通知 HR',
        position: { x: 400, y: 150 },
        config: {
          channel: '邮件',
          recipients: ['王五'],
          templateId: '审批通知模板',
        },
      },
      {
        id: 'node-3',
        stepDefId: 'step-condition',
        label: '请假天数判断',
        position: { x: 250, y: 350 },
        config: {
          field: 'days',
          operator: '大于',
          compareValue: '3',
        },
      },
    ],
    edges: [
      { id: 'edge-1-2', source: 'node-1', target: 'node-2' },
      { id: 'edge-1-3', source: 'node-1', target: 'node-3' },
    ],
    createdAt: '2025-06-10 09:00:00',
    updatedAt: '2025-06-10 14:30:00',
  },
  {
    id: 'wf-demo-2',
    name: '数据同步流程',
    description: '定时从外部 API 拉取数据 → 转换格式 → 写入数据库',
    status: 'draft',
    nodes: [
      {
        id: 'node-sync-1',
        stepDefId: 'step-http-req',
        label: '拉取外部数据',
        position: { x: 100, y: 100 },
        config: {
          url: 'https://api.example.com/data',
          method: 'GET',
          headers: ['Authorization: Bearer xxx'],
          timeout: 30,
        },
      },
      {
        id: 'node-sync-2',
        stepDefId: 'step-data-transform',
        label: 'JSON 转换',
        position: { x: 400, y: 100 },
        config: {
          transformType: 'JSON → XML',
          sourceField: 'response',
          targetField: 'payload',
          mappingRules: ['id→externalId', 'name→title'],
        },
      },
    ],
    edges: [
      { id: 'edge-sync-1-2', source: 'node-sync-1', target: 'node-sync-2' },
    ],
    createdAt: '2025-06-12 10:00:00',
    updatedAt: '2025-06-12 10:00:00',
  },
];

export default presetWorkflows;
