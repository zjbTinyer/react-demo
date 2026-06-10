import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button, Space, Tag, Input, Select, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import useStepStore from '../../stores/stepStore';

export default function StepLibrary() {
  const navigate = useNavigate();
  const { steps, getCategories, deleteStep } = useStepStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [data, setData] = useState(steps);

  const categories = getCategories();

  const filterData = useCallback(() => {
    let result = steps;
    if (category && category !== 'all') {
      result = result.filter((s) => s.category === category);
    }
    if (search.trim()) {
      const kw = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(kw) ||
          s.description.toLowerCase().includes(kw) ||
          s.category.toLowerCase().includes(kw)
      );
    }
    setData(result);
  }, [steps, search, category]);

  useEffect(() => { filterData(); }, [filterData]);

  const handleDelete = (id, name) => {
    deleteStep(id);
  };

  const columns = [
    {
      title: '步骤名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <a onClick={() => navigate(`/steps/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '配置字段数',
      key: 'fields',
      width: 100,
      render: (_, record) => record.configSchema?.length || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/steps/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除「${record.name}」吗？`}
            onConfirm={() => handleDelete(record.id, record.name)}
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
      title="步骤库"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/steps/new')}>
          新建步骤类型
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索步骤名称或描述"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          placeholder="分类筛选"
          value={category}
          onChange={setCategory}
          style={{ width: 160 }}
          allowClear
          onClear={() => setCategory('all')}
        >
          <Select.Option value="all">全部分类</Select.Option>
          {categories.map((cat) => (
            <Select.Option key={cat} value={cat}>{cat}</Select.Option>
          ))}
        </Select>
      </Space>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
