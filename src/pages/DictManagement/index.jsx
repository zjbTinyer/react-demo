import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button, Space, Tag, Input, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import useDictStore from '../../stores/dictStore';

export default function DictManagement() {
  const navigate = useNavigate();
  const { dicts, deleteDict } = useDictStore();
  const [search, setSearch] = useState('');
  const [data, setData] = useState(dicts);

  const filterData = useCallback(() => {
    let result = dicts;
    if (search.trim()) {
      const kw = search.toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(kw) || d.description.toLowerCase().includes(kw));
    }
    setData(result);
  }, [dicts, search]);

  useEffect(() => { filterData(); }, [filterData]);

  const columns = [
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <a onClick={() => navigate(`/dicts/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '列数',
      key: 'columns',
      width: 80,
      render: (_, record) => record.columns?.length || 0,
    },
    {
      title: '数据行数',
      key: 'rows',
      width: 80,
      render: (_, record) => record.rows?.length || 0,
    },
    {
      title: '列定义',
      key: 'columnDefs',
      render: (_, record) =>
        record.columns?.map((col) => (
          <Tag key={col.name} style={{ marginBottom: 4 }}>{col.label}</Tag>
        )),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/dicts/${record.id}`)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除「${record.name}」吗？`}
            onConfirm={() => deleteDict(record.id)}
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
      title="字典管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/dicts/new')}>
          新建字典
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索字典名称或描述"
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
