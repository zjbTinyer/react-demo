import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button, Space, Tag, Input, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlayCircleOutlined, EyeOutlined } from '@ant-design/icons';
import useWorkflowStore from '../../stores/workflowStore';
import useInstanceStore from '../../stores/instanceStore';
import { generateId, now } from '../../utils/id';

export default function WorkflowManagement() {
  const navigate = useNavigate();
  const { workflows, deleteWorkflow } = useWorkflowStore();
  const { addInstance } = useInstanceStore();
  const [search, setSearch] = useState('');
  const [data, setData] = useState(workflows);

  const filterData = useCallback(() => {
    let result = workflows;
    if (search.trim()) {
      const kw = search.toLowerCase();
      result = result.filter((w) => w.name.toLowerCase().includes(kw) || w.description?.toLowerCase().includes(kw));
    }
    setData(result);
  }, [workflows, search]);

  useEffect(() => { filterData(); }, [filterData]);

  const handleCreateInstance = (wf) => {
    const nodeStates = (wf.nodes || []).map((n) => ({
      nodeId: n.id,
      status: 'pending',
    }));
    const inst = addInstance({
      workflowId: wf.id,
      workflowName: wf.name,
      status: 'running',
      nodeStates,
    });
    navigate(`/instances/${inst.id}`);
  };

  const statusColors = { draft: 'default', published: 'green' };

  const columns = [
    {
      title: '工作流名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <a onClick={() => navigate(`/workflows/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (s) => <Tag color={statusColors[s] || 'default'}>{s === 'published' ? '已发布' : '草稿'}</Tag>,
    },
    {
      title: '步骤数',
      key: 'nodes',
      width: 80,
      render: (_, record) => record.nodes?.length || 0,
    },
    {
      title: '连线数',
      key: 'edges',
      width: 80,
      render: (_, record) => record.edges?.length || 0,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 170,
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/workflows/${record.id}`)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleCreateInstance(record)}>
            执行
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定删除「${record.name}」吗？`}
            onConfirm={() => deleteWorkflow(record.id)}
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
    <Card
      title="工作流列表"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/workflows/new')}>
          新建工作流
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索工作流名称或描述"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </Space>
      <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
    </Card>
  );
}
