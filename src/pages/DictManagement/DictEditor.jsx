import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Form, Input, Select, Button, Space, Divider, Table, Modal,
  message, Popconfirm, Tag, Empty,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined, EditOutlined,
} from '@ant-design/icons';
import useDictStore from '../../stores/dictStore';
import { generateId } from '../../utils/id';

const DATA_TYPES = [
  { value: 'string', label: '字符串' },
  { value: 'number', label: '数字' },
];

export default function DictEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { getById, addDict, updateDict, addRow, updateRow, deleteRow, getAll } = useDictStore();

  const [form] = Form.useForm();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  // 列编辑弹窗
  const [colModalVisible, setColModalVisible] = useState(false);
  const [editingColIdx, setEditingColIdx] = useState(-1);
  const [colForm] = Form.useForm();

  // 行编辑弹窗
  const [rowModalVisible, setRowModalVisible] = useState(false);
  const [editingRowIdx, setEditingRowIdx] = useState(-1);
  const [rowForm] = Form.useForm();

  // 加载已有数据
  useEffect(() => {
    if (isEdit) {
      const dict = getById(id);
      if (dict) {
        form.setFieldsValue({ name: dict.name, description: dict.description });
        setColumns(dict.columns || []);
        setRows(dict.rows || []);
      }
    }
  }, [id, isEdit, getById, form]);

  // ===== 保存 =====
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (columns.length === 0) {
        message.warning('请至少定义一个列');
        return;
      }
      const data = { ...values, columns, rows };
      if (isEdit) {
        updateDict(id, data);
        message.success('字典已更新');
      } else {
        const newDict = addDict(data);
        message.success('字典已创建');
        navigate(`/dicts/${newDict.id}`, { replace: true });
      }
    });
  };

  // ===== 列编辑 =====
  const openColModal = (idx = -1) => {
    setEditingColIdx(idx);
    if (idx >= 0) {
      colForm.setFieldsValue(columns[idx]);
    } else {
      colForm.resetFields();
    }
    setColModalVisible(true);
  };

  const handleColOk = () => {
    colForm.validateFields().then((col) => {
      const newCols = [...columns];
      if (editingColIdx >= 0) {
        newCols[editingColIdx] = col;
      } else {
        newCols.push(col);
      }
      setColumns(newCols);
      setColModalVisible(false);
    });
  };

  const removeCol = (idx) => {
    setColumns(columns.filter((_, i) => i !== idx));
  };

  // ===== 行编辑 =====
  const openRowModal = (idx = -1) => {
    setEditingRowIdx(idx);
    if (idx >= 0) {
      rowForm.setFieldsValue(rows[idx]);
    } else {
      rowForm.resetFields();
    }
    setRowModalVisible(true);
  };

  const handleRowOk = () => {
    rowForm.validateFields().then((row) => {
      if (editingRowIdx >= 0) {
        const newRows = [...rows];
        newRows[editingRowIdx] = { ...newRows[editingRowIdx], ...row };
        setRows(newRows);
      } else {
        const maxId = rows.reduce((max, r) => Math.max(max, r.id || 0), 0);
        setRows([...rows, { id: maxId + 1, ...row }]);
      }
      setRowModalVisible(false);
    });
  };

  // ===== 表格列定义 =====
  const tableColumns = columns.map((col) => ({
    title: col.label,
    dataIndex: col.name,
    key: col.name,
    ellipsis: true,
  }));
  tableColumns.push({
    title: '操作',
    key: 'actions',
    width: 120,
    render: (_, record, idx) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openRowModal(idx)} />
        <Popconfirm title="删除此行？" onConfirm={() => setRows(rows.filter((_, i) => i !== idx))}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  });

  return (
    <Card
      title={isEdit ? '编辑字典' : '新建字典'}
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dicts')}>返回列表</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
        </Space>
      }
    >
      {/* 基本信息 */}
      <Form form={form} layout="vertical" style={{ maxWidth: 500 }}>
        <Form.Item name="name" label="字典名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="如：用户表" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={2} placeholder="描述字典用途" />
        </Form.Item>
      </Form>

      <Divider>列定义</Divider>
      <Button type="dashed" icon={<PlusOutlined />} onClick={() => openColModal(-1)} style={{ marginBottom: 16 }}>
        添加列
      </Button>
      {columns.length === 0 ? (
        <Empty description="暂无列定义" />
      ) : (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {columns.map((col, idx) => (
            <Tag key={idx} closable onClose={() => removeCol(idx)}
              style={{ padding: '4px 8px', fontSize: 14 }}
              color="blue"
            >
              {col.label} ({col.name}) — {col.type}
            </Tag>
          ))}
        </div>
      )}

      <Divider>数据行</Divider>
      <Button type="dashed" icon={<PlusOutlined />} onClick={() => openRowModal(-1)} style={{ marginBottom: 16 }}
        disabled={columns.length === 0}>
        添加数据行
      </Button>
      <Table
        dataSource={rows}
        columns={tableColumns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '暂无数据行' }}
      />

      {/* 列编辑弹窗 */}
      <Modal
        title={editingColIdx >= 0 ? '编辑列' : '添加列'}
        open={colModalVisible}
        onOk={handleColOk}
        onCancel={() => setColModalVisible(false)}
        destroyOnClose
      >
        <Form form={colForm} layout="vertical">
          <Form.Item name="name" label="字段标识" rules={[{ required: true }]}>
            <Input placeholder="如：id, name, email" />
          </Form.Item>
          <Form.Item name="label" label="显示名称" rules={[{ required: true }]}>
            <Input placeholder="如：ID, 姓名, 邮箱" />
          </Form.Item>
          <Form.Item name="type" label="数据类型" rules={[{ required: true }]}>
            <Select options={DATA_TYPES} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 行编辑弹窗 */}
      <Modal
        title={editingRowIdx >= 0 ? '编辑数据行' : '添加数据行'}
        open={rowModalVisible}
        onOk={handleRowOk}
        onCancel={() => setRowModalVisible(false)}
        destroyOnClose
        width={500}
      >
        <Form form={rowForm} layout="vertical">
          {columns.map((col) => (
            <Form.Item key={col.name} name={col.name} label={col.label}
              rules={col.name === 'id' ? [] : [{ required: true, message: `请输入${col.label}` }]}>
              <Input type={col.type === 'number' ? 'number' : 'text'} placeholder={`请输入${col.label}`} />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </Card>
  );
}
