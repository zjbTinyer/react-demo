/** 预置工作流实例数据 */
/** @type {import('../types').WorkflowInstance[]} */
const presetInstances = [
  {
    id: 'inst-001',
    workflowId: 'wf-demo-1',
    workflowName: '请假审批流程',
    status: 'completed',
    nodeStates: [
      { nodeId: 'node-1', status: 'done', result: { approvedBy: '张三', approvedAt: '2025-06-15 10:30:00', comment: '同意' } },
      { nodeId: 'node-2', status: 'done', result: { sentTo: '王五', sentAt: '2025-06-15 10:35:00' } },
      { nodeId: 'node-3', status: 'done', result: { matched: false, branch: 'default' } },
    ],
    createdAt: '2025-06-15 10:00:00',
    completedAt: '2025-06-15 10:35:00',
  },
  {
    id: 'inst-002',
    workflowId: 'wf-demo-1',
    workflowName: '请假审批流程',
    status: 'running',
    nodeStates: [
      { nodeId: 'node-1', status: 'done', result: { approvedBy: '张三', approvedAt: '2025-06-16 09:15:00', comment: '同意' } },
      { nodeId: 'node-2', status: 'running' },
      { nodeId: 'node-3', status: 'pending' },
    ],
    createdAt: '2025-06-16 09:00:00',
  },
  {
    id: 'inst-003',
    workflowId: 'wf-demo-2',
    workflowName: '数据同步流程',
    status: 'failed',
    nodeStates: [
      { nodeId: 'node-sync-1', status: 'done', result: { statusCode: 200, rowCount: 150 } },
      { nodeId: 'node-sync-2', status: 'failed', result: { error: '字段映射失败：targetField 不存在' } },
    ],
    createdAt: '2025-06-16 08:00:00',
    completedAt: '2025-06-16 08:02:00',
  },
];

export default presetInstances;
