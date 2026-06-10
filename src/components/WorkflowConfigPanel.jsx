import { Divider, Tag, Button, Empty, Descriptions } from 'antd';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import DynamicConfigForm from './DynamicConfigForm';
import useStepStore from '../stores/stepStore';

const categoryColors = {
  'HTTP': '#1890ff',
  '审批': '#722ed1',
  '通知': '#13c2c2',
  '脚本': '#fa8c16',
  '数据处理': '#52c41a',
  '流程控制': '#eb2f96',
};

/**
 * 右侧配置面板
 * 当用户点击画布中的节点时，显示该节点的步骤信息和配置表单
 *
 * @param {Object} props
 * @param {Object|null} props.selectedNode - 当前选中的 ReactFlow 节点
 * @param {Function} props.onConfigChange - 配置变更回调 (nodeId, fieldName, value)
 * @param {Function} props.onDeleteNode - 删除节点回调 (nodeId)
 * @param {boolean} props.readOnly - 是否只读模式
 */
export default function WorkflowConfigPanel({ selectedNode, onConfigChange, onDeleteNode, readOnly = false }) {
  const getById = useStepStore((s) => s.getById);

  if (!selectedNode) {
    return (
      <div style={{ padding: 24, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: '#999' }}>
              <InfoCircleOutlined style={{ marginRight: 4 }} />
              点击画布中的步骤节点<br />查看和编辑配置
            </span>
          }
        />
      </div>
    );
  }

  const stepDef = getById(selectedNode.data.stepDefId);

  if (!stepDef) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="未找到步骤定义（可能已被删除）" />
      </div>
    );
  }

  const handleConfigChange = (fieldName, value) => {
    onConfigChange?.(selectedNode.id, fieldName, value);
  };

  return (
    <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
      {/* 节点信息 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{selectedNode.data.label}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <Tag color={categoryColors[stepDef.category] || '#1890ff'}>{stepDef.category}</Tag>
          <Tag>{stepDef.name}</Tag>
        </div>
        <div style={{ fontSize: 12, color: '#666' }}>{stepDef.description}</div>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* 动态配置表单 */}
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>步骤配置</div>
      <DynamicConfigForm
        configSchema={stepDef.configSchema}
        values={selectedNode.data.config || {}}
        onChange={handleConfigChange}
        readOnly={readOnly}
      />

      {!readOnly && (
        <>
          <Divider style={{ margin: '16px 0' }} />
          <Button
            danger
            block
            icon={<DeleteOutlined />}
            onClick={() => onDeleteNode?.(selectedNode.id)}
          >
            从工作流中移除
          </Button>
        </>
      )}
    </div>
  );
}
