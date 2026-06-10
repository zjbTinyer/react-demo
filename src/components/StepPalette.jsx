import { useState } from 'react';
import { Input, Select, List, Tag, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
 * 左侧步骤面板
 * 展示所有可用的 StepDefinition，支持按分类筛选和搜索，支持拖拽到画布
 */
export default function StepPalette() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const { steps, getCategories } = useStepStore();
  const categories = getCategories();

  // 过滤
  let filtered = steps;
  if (category && category !== 'all') {
    filtered = filtered.filter((s) => s.category === category);
  }
  if (search.trim()) {
    const kw = search.toLowerCase();
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(kw) || s.description.toLowerCase().includes(kw)
    );
  }

  // 拖拽开始 — 将 StepDefinition 信息写入 dataTransfer
  const onDragStart = (event, stepDef) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ stepDefId: stepDef.id, name: stepDef.name, category: stepDef.category, configSchema: stepDef.configSchema })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ padding: 12, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>步骤库</div>

      <Select
        value={category}
        onChange={setCategory}
        style={{ width: '100%', marginBottom: 8 }}
        size="small"
      >
        <Select.Option value="all">全部分类</Select.Option>
        {categories.map((cat) => (
          <Select.Option key={cat} value={cat}>{cat}</Select.Option>
        ))}
      </Select>

      <Input
        placeholder="搜索步骤"
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        size="small"
        style={{ marginBottom: 12 }}
      />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {filtered.length === 0 ? (
          <Empty description="无匹配步骤" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            dataSource={filtered}
            size="small"
            renderItem={(step) => (
              <div
                draggable
                onDragStart={(e) => onDragStart(e, step)}
                style={{
                  padding: '8px 12px',
                  marginBottom: 6,
                  borderRadius: 6,
                  border: '1px solid #e8e8e8',
                  background: '#fafafa',
                  cursor: 'grab',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.background = '#f0f5ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e8';
                  e.currentTarget.style.background = '#fafafa';
                }}
              >
                <div style={{ fontWeight: 500, fontSize: 13 }}>{step.name}</div>
                <div style={{ marginTop: 2 }}>
                  <Tag
                    color={categoryColors[step.category] || '#1890ff'}
                    style={{ fontSize: 10, lineHeight: '16px' }}
                  >
                    {step.category}
                  </Tag>
                </div>
              </div>
            )}
          />
        )}
      </div>

      <div style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: '1px solid #f0f0f0',
        fontSize: 11,
        color: '#999',
        textAlign: 'center',
      }}>
        拖拽步骤到画布添加
      </div>
    </div>
  );
}
