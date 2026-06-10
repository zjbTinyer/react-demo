import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Button, Space, List, Tag } from 'antd';
import {
  ThunderboltOutlined,
  BookOutlined,
  ApartmentOutlined,
  ProfileOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import useStepStore from '../../stores/stepStore';
import useDictStore from '../../stores/dictStore';
import useWorkflowStore from '../../stores/workflowStore';
import useInstanceStore from '../../stores/instanceStore';

const statusColors = {
  running: 'processing',
  completed: 'success',
  failed: 'error',
  cancelled: 'default',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const stepCount = useStepStore((s) => s.steps.length);
  const dictCount = useDictStore((s) => s.dicts.length);
  const workflowCount = useWorkflowStore((s) => s.workflows.length);
  const instances = useInstanceStore((s) => s.instances);
  const instanceCount = instances.length;
  const runningCount = instances.filter((i) => i.status === 'running').length;
  const workflows = useWorkflowStore((s) => s.workflows);

  const recentInstances = [...instances]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5);

  const quickCards = [
    { title: '步骤类型', count: stepCount, icon: <ThunderboltOutlined />, color: '#1890ff', bg: '#e6f7ff', path: '/steps' },
    { title: '字典表', count: dictCount, icon: <BookOutlined />, color: '#52c41a', bg: '#f6ffed', path: '/dicts' },
    { title: '工作流', count: workflowCount, icon: <ApartmentOutlined />, color: '#722ed1', bg: '#f9f0ff', path: '/workflows' },
    { title: '实例', count: `${instanceCount} / ${runningCount} 运行中`, icon: <ProfileOutlined />, color: '#fa8c16', bg: '#fff7e6', path: '/instances' },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {quickCards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card
              hoverable
              onClick={() => navigate(card.path)}
              style={{ cursor: 'pointer', borderLeft: `3px solid ${card.color}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Statistic title={card.title} value={card.count} valueStyle={{ fontSize: 24 }} />
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  color: card.color,
                }}>
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card
            title="可用工作流"
            extra={<a onClick={() => navigate('/workflows')}>全部 <RightOutlined /></a>}
          >
            {workflows.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
                暂无工作流，<a onClick={() => navigate('/workflows/new')}>立即创建</a>
              </div>
            ) : (
              <List
                dataSource={workflows}
                size="small"
                renderItem={(wf) => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/workflows/${wf.id}`)}
                    extra={
                      <Button size="small" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workflows/${wf.id}`);
                      }}>
                        编辑
                      </Button>
                    }
                  >
                    <List.Item.Meta
                      title={wf.name}
                      description={`${wf.nodes?.length || 0} 个步骤 · ${wf.edges?.length || 0} 条连线`}
                    />
                    <Tag>{wf.status === 'published' ? '已发布' : '草稿'}</Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="最近实例"
            extra={<a onClick={() => navigate('/instances')}>全部 <RightOutlined /></a>}
          >
            {recentInstances.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
                暂无实例，从工作流页面创建
              </div>
            ) : (
              <List
                dataSource={recentInstances}
                size="small"
                renderItem={(inst) => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/instances/${inst.id}`)}
                  >
                    <List.Item.Meta
                      title={inst.workflowName}
                      description={`${inst.id} · ${inst.createdAt}`}
                    />
                    <Tag color={statusColors[inst.status] || 'default'}>{inst.status}</Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
