import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Timeline, Button, Space, Divider, Empty } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import useInstanceStore from '../../stores/instanceStore';
import useWorkflowStore from '../../stores/workflowStore';
import useStepStore from '../../stores/stepStore';

const nodeStatusConfig = {
  pending: { color: 'default', icon: <ClockCircleOutlined />, label: '等待中' },
  running: { color: 'processing', icon: <SyncOutlined spin />, label: '执行中' },
  done: { color: 'success', icon: <CheckCircleOutlined />, label: '已完成' },
  failed: { color: 'error', icon: <CloseCircleOutlined />, label: '失败' },
};

const instanceStatusConfig = {
  running: { color: 'processing', label: '运行中' },
  completed: { color: 'success', label: '已完成' },
  failed: { color: 'error', label: '失败' },
  cancelled: { color: 'default', label: '已取消' },
};

export default function InstanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getById = useInstanceStore((s) => s.getById);
  const getWorkflowById = useWorkflowStore((s) => s.getById);
  const getStepById = useStepStore((s) => s.getById);

  const instance = getById(id);
  if (!instance) {
    return (
      <Card>
        <Empty description="未找到该实例" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={() => navigate('/instances')}>返回列表</Button>
        </div>
      </Card>
    );
  }

  const workflow = getWorkflowById(instance.workflowId);
  const instCfg = instanceStatusConfig[instance.status] || { color: 'default', label: instance.status };

  // 构建节点状态信息：合并 workflow 的 node 和 instance 的 nodeStates
  const nodeDetails = (workflow?.nodes || []).map((wfNode) => {
    const state = instance.nodeStates?.find((ns) => ns.nodeId === wfNode.id) || { status: 'pending' };
    const stepDef = getStepById(wfNode.stepDefId);
    return { ...wfNode, stepDef, nodeState: state };
  });

  return (
    <Card
      title={`实例详情: ${instance.id}`}
      extra={
        <Space>
          <Tag color={instCfg.color}>{instCfg.label}</Tag>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/instances')}>返回列表</Button>
          <Button onClick={() => navigate(`/workflows/${instance.workflowId}`)}>查看工作流</Button>
        </Space>
      }
    >
      <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="实例 ID">{instance.id}</Descriptions.Item>
        <Descriptions.Item label="工作流">{instance.workflowName}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{instance.createdAt}</Descriptions.Item>
        <Descriptions.Item label="完成时间">{instance.completedAt || '-'}</Descriptions.Item>
        <Descriptions.Item label="节点总数">{instance.nodeStates?.length || 0}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={instCfg.color}>{instCfg.label}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider>节点执行状态</Divider>

      {nodeDetails.length === 0 ? (
        <Empty description="该工作流没有节点" />
      ) : (
        <Timeline
          items={nodeDetails.map((nd) => {
            const cfg = nodeStatusConfig[nd.nodeState.status] || nodeStatusConfig.pending;
            const configKeys = nd.config ? Object.keys(nd.config) : [];
            return {
              color: cfg.color === 'success' ? 'green' : cfg.color === 'error' ? 'red' : cfg.color === 'processing' ? 'blue' : 'gray',
              dot: cfg.icon,
              children: (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {nd.label}
                    {nd.stepDef && (
                      <Tag style={{ marginLeft: 8 }} color="blue">{nd.stepDef.category}</Tag>
                    )}
                    <Tag color={cfg.color}>{cfg.label}</Tag>
                  </div>

                  {nd.stepDef && (
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                      步骤类型: {nd.stepDef.name}
                    </div>
                  )}

                  {/* 显示配置值 */}
                  {configKeys.length > 0 && (
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
                      {configKeys.map((key) => (
                        <span key={key} style={{ marginRight: 12 }}>
                          <strong>{key}</strong>: {JSON.stringify(nd.config[key])}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 执行结果 */}
                  {nd.nodeState.result && (
                    <div style={{
                      marginTop: 8,
                      padding: 8,
                      background: '#f6f6f6',
                      borderRadius: 4,
                      fontSize: 12,
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      maxHeight: 120,
                      overflow: 'auto',
                    }}>
                      {JSON.stringify(nd.nodeState.result, null, 2)}
                    </div>
                  )}
                </div>
              ),
            };
          })}
        />
      )}
    </Card>
  );
}
