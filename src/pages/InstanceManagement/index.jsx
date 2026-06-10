import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button, Space, Tag, Select, Popconfirm } from 'antd';
import { EyeOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import useInstanceStore from '../../stores/instanceStore';
import useWorkflowStore from '../../stores/workflowStore';

const statusConfig = {
  running: { color: 'processing', label: '运行中' },
  completed: { color: 'success', label: '已完成' },
  failed: { color: 'error', label: '失败' },
  cancelled: { color: 'default', label: '已取消' },
};

export default function InstanceManagement() {
  const navigate = useNavigate();
  const { instances, deleteInstance } = useInstanceStore();
  const workflows = useWorkflowStore((s) => s.workflows);
  const [statusFilter, setStatusFilter] = useState('all');
  const [wfFilter, setWfFilter] = useState('all');
  const [data, setData] = useState(instances);

  const filterData = useCallback(() => {
    let result = instances;
    if (statusFilter !== 'all') {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (wfFilter !== 'all') {
      result = result.filter((i) => i.workflowId === wfFilter);
    }
    setData(result);
  }, [instances, statusFilter, wfFilter]);

  useEffect(() => { filterData(); }, [filterData]);

  const columns = [
    {
      title: '实例 ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: '工作流名称',
      dataIndex: 'workflowName',
      key: 'workflowName',
      width: 200,
      render: (text, record) => (
        <a onClick={() => navigate(`/instances/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s) => {
        const cfg = statusConfig[s] || { color: 'default', label: s };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '节点进度',
      key: 'progress',
      width: 160,
      render: (_, record) => {
        const total = record.nodeStates?.length || 0;
        const done = record.nodeStates?.filter((n) => n.status === 'done').length || 0;
        const running = record.nodeStates?.filter((n) => n.status === 'running').length || 0;
        const failed = record.nodeStates?.filter((n) => n.status === 'failed').length || 0;
        return (
          <Space size={4}>
            {done > 0 && <Tag color="green">✓ {done}</Tag>}
            {running > 0 && <Tag color="blue">⏳ {running}</Tag>}
            {failed > 0 && <Tag color="red">✗ {failed}</Tag>}
            <span style={{ color: '#999', fontSize: 12 }}>/ {total}</span>
          </Space>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
    },
    {
      title: '完成时间',
      dataIndex: 'completedAt',
      key: 'completedAt',
      width: 170,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/instances/${record.id}`)}>
            查看
          </Button>
          <Popconfirm
            title="确认删除"
            description="删除此实例？"
            onConfirm={() => deleteInstance(record.id)}
            okText="删除"
            okType="danger"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="实例列表">
      <Space style={{ marginBottom: 16 }}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
          prefix={<FilterOutlined />}
        >
          <Select.Option value="all">全部状态</Select.Option>
          <Select.Option value="running">运行中</Select.Option>
          <Select.Option value="completed">已完成</Select.Option>
          <Select.Option value="failed">失败</Select.Option>
          <Select.Option value="cancelled">已取消</Select.Option>
        </Select>
        <Select
          value={wfFilter}
          onChange={setWfFilter}
          style={{ width: 200 }}
          placeholder="按工作流筛选"
          allowClear
          onClear={() => setWfFilter('all')}
        >
          <Select.Option value="all">全部工作流</Select.Option>
          {workflows.map((wf) => (
            <Select.Option key={wf.id} value={wf.id}>{wf.name}</Select.Option>
          ))}
        </Select>
      </Space>
      <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
    </Card>
  );
}
