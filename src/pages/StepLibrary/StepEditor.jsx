import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Form, Input, Select, Button, Space, Divider, message,
  Modal, Empty, Tag,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, ArrowLeftOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import useStepStore from '../../stores/stepStore';
import useDictStore from '../../stores/dictStore';
import { generateId, now } from '../../utils/id';

export default function StepEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { getById, addStep, updateStep } = useStepStore();
  const dicts = useDictStore((s) => s.dicts);

  const [form] = Form.useForm();
  const [configFields, setConfigFields] = useState([]);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState(-1);
  const [fieldForm] = Form.useForm();

  // 加载已有数据
  useEffect(() => {
    if (isEdit) {
      const step = getById(id);
      if (step) {
        form.setFieldsValue({
          name: step.name,
          description: step.description,
          category: step.category,
        });
        setConfigFields(step.configSchema || []);
      }
    }
  }, [id, isEdit, getById, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (configFields.length === 0) {
        message.warning('请至少添加一个配置字段');
        return;
      }
      const data = {
        ...values,
        configSchema: configFields,
      };
      if (isEdit) {
        updateStep(id, data);
        message.success('步骤类型已更新');
      } else {
        const newStep = addStep(data);
        message.success('步骤类型已创建');
        navigate(`/steps/${newStep.id}`, { replace: true });
      }
    });
  };

  // ===== 配置字段编辑 =====
  const openFieldModal = (index = -1) => {
    setEditingFieldIndex(index);
    if (index >= 0) {
      const field = configFields[index];
      fieldForm.setFieldsValue(field);
    } else {
      fieldForm.resetFields();
    }
    setFieldModalVisible(true);
  };

  const handleFieldOk = () => {
    fieldForm.validateFields().then((field) => {
      const newFields = [...configFields];
      if (editingFieldIndex >= 0) {
        newFields[editingFieldIndex] = field;
      } else {
        newFields.push(field);
      }
      setConfigFields(newFields);
      setFieldModalVisible(false);
    });
  };

  const removeField = (index) => {
    setConfigFields(configFields.filter((_, i) => i !== index));
  };

  const valueType = Form.useWatch('valueType', fieldForm);

  return (
    <Card
      title={isEdit ? '编辑步骤类型' : '新建步骤类型'}
      extra={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/steps')}>
            返回列表
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item name="name" label="步骤名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="如：HTTP 请求" />
        </Form.Item>
        <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
          <Select placeholder="选择或输入分类"
            showSearch
            optionFilterProp="label"
            options={[
              { value: 'HTTP', label: 'HTTP' },
              { value: '审批', label: '审批' },
              { value: '通知', label: '通知' },
              { value: '脚本', label: '脚本' },
              { value: '数据处理', label: '数据处理' },
              { value: '流程控制', label: '流程控制' },
            ]}
          />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} placeholder="描述该步骤类型的功能和用途" />
        </Form.Item>
      </Form>

      <Divider>配置字段 (Config Schema)</Divider>

      <div style={{ marginBottom: 16 }}>
        <Button type="dashed" icon={<PlusOutlined />} onClick={() => openFieldModal(-1)}>
          添加配置字段
        </Button>
      </div>

      {configFields.length === 0 ? (
        <Empty description="暂无配置字段，点击上方按钮添加" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 600 }}>
          {configFields.map((field, idx) => (
            <Card key={idx} size="small" type="inner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{field.label}</strong>
                  <span style={{ marginLeft: 8, color: '#888' }}>({field.name})</span>
                  <span style={{ marginLeft: 8 }}>
                    <Tag>{field.valueType === 'fixed' ? '固定值' : field.valueType === 'list' ? '列表' : '字典引用'}</Tag>
                    {field.required && <Tag color="red">必填</Tag>}
                  </span>
                </div>
                <Space>
                  <Button type="link" size="small" onClick={() => openFieldModal(idx)}>编辑</Button>
                  <Button type="link" size="small" danger onClick={() => removeField(idx)}>删除</Button>
                </Space>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 配置字段弹窗 */}
      <Modal
        title={editingFieldIndex >= 0 ? '编辑配置字段' : '添加配置字段'}
        open={fieldModalVisible}
        onOk={handleFieldOk}
        onCancel={() => setFieldModalVisible(false)}
        destroyOnClose
        width={500}
      >
        <Form form={fieldForm} layout="vertical"
          initialValues={{ valueType: 'fixed', dataType: 'string', required: false }}>
          <Form.Item name="name" label="字段标识 (Name)"
            rules={[{ required: true, message: '请输入字段标识' }]}
            help="英文标识，如 url, method, approver"
          >
            <Input placeholder="url" />
          </Form.Item>
          <Form.Item name="label" label="显示名称 (Label)"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input placeholder="请求地址" />
          </Form.Item>
          <Form.Item name="valueType" label="值来源类型"
            rules={[{ required: true }]}>
            <Select>
              <Select.Option value="fixed">固定值</Select.Option>
              <Select.Option value="list">固定列表</Select.Option>
              <Select.Option value="dict">字典引用</Select.Option>
            </Select>
          </Form.Item>

          {valueType === 'fixed' && (
            <>
              <Form.Item name="dataType" label="数据类型">
                <Select>
                  <Select.Option value="string">字符串</Select.Option>
                  <Select.Option value="number">数字</Select.Option>
                  <Select.Option value="boolean">布尔</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="options" label="预定义选项" help="每行一个选项，留空则不限制">
                <Select mode="tags" tokenSeparators={[',']} placeholder="GET, POST, PUT" />
              </Form.Item>
            </>
          )}

          {valueType === 'list' && (
            <Form.Item name="dataType" label="列表项类型">
              <Select>
                <Select.Option value="string">字符串</Select.Option>
                <Select.Option value="number">数字</Select.Option>
              </Select>
            </Form.Item>
          )}

          {valueType === 'dict' && (
            <>
              <Form.Item name="dictId" label="引用字典"
                rules={[{ required: true, message: '请选择字典' }]}>
                <Select placeholder="选择数据字典">
                  {dicts.map((d) => (
                    <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="dictColumn" label="引用列"
                rules={[{ required: true, message: '请选择列' }]}
                help="选择从该字典的哪一列获取值"
              >
                <Select placeholder="选择列">
                  {(fieldForm.getFieldValue('dictId')
                    ? dicts.find((d) => d.id === fieldForm.getFieldValue('dictId'))?.columns || []
                    : []
                  ).map((col) => (
                    <Select.Option key={col.name} value={col.name}>{col.label} ({col.name})</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item name="placeholder" label="占位提示">
            <Input placeholder="输入提示文本" />
          </Form.Item>
          <Form.Item name="required" label="是否必填">
            <Select>
              <Select.Option value={true}>必填</Select.Option>
              <Select.Option value={false}>选填</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
