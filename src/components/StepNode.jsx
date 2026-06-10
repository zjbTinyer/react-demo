import { memo } from 'react';
import { Handle, Position } from '@reactflow/core';
import { Tag } from 'antd';
import {
  ApiOutlined,
  AuditOutlined,
  BellOutlined,
  CodeOutlined,
  ToolOutlined,
  BranchesOutlined,
} from '@ant-design/icons';

const categoryIcons = {
  'HTTP': <ApiOutlined />,
  '审批': <AuditOutlined />,
  '通知': <BellOutlined />,
  '脚本': <CodeOutlined />,
  '数据处理': <ToolOutlined />,
  '流程控制': <BranchesOutlined />,
};

const categoryColors = {
  'HTTP': '#1890ff',
  '审批': '#722ed1',
  '通知': '#13c2c2',
  '脚本': '#fa8c16',
  '数据处理': '#52c41a',
  '流程控制': '#eb2f96',
};

/**
 * ReactFlow 自定义节点 — 画布中的 Step 节点
 * 显示步骤名称、分类标签，带输入输出连接点
 */
const StepNode = memo(({ data, selected }) => {
  const { label, category, configCount } = data;
  const icon = categoryIcons[category] || <ToolOutlined />;
  const color = categoryColors[category] || '#1890ff';

  return (
    <div style={{
      padding: '10px 14px',
      borderRadius: 8,
      border: selected ? `2px solid ${color}` : '1px solid #d9d9d9',
      background: selected ? '#f0f5ff' : '#fff',
      minWidth: 160,
      cursor: 'pointer',
      boxShadow: selected ? `0 0 8px ${color}40` : '0 1px 4px rgba(0,0,0,0.08)',
      transition: 'all 0.2s',
    }}>
      {/* 输入连接点（上方） */}
      <Handle type="target" position={Position.Top}
        style={{ background: color, width: 10, height: 10, border: '2px solid #fff' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color, fontSize: 16 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4 }}>{label}</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <Tag color={color} style={{ fontSize: 10, lineHeight: '16px', margin: 0 }}>{category}</Tag>
            {configCount > 0 && (
              <span style={{ fontSize: 11, color: '#999' }}>{configCount} 项配置</span>
            )}
          </div>
        </div>
      </div>

      {/* 输出连接点（下方） */}
      <Handle type="source" position={Position.Bottom}
        style={{ background: color, width: 10, height: 10, border: '2px solid #fff' }} />
    </div>
  );
});

StepNode.displayName = 'StepNode';

export default StepNode;
