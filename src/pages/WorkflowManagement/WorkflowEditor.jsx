import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@reactflow/core';
import { Background } from '@reactflow/background';
import { Controls } from '@reactflow/controls';
import { MiniMap } from '@reactflow/minimap';
import '@reactflow/core/dist/style.css';
import { Layout, Button, Space, Input, message, Breadcrumb, Tag } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, PlayCircleOutlined } from '@ant-design/icons';
import StepPalette from '../../components/StepPalette';
import StepNode from '../../components/StepNode';
import WorkflowConfigPanel from '../../components/WorkflowConfigPanel';
import useWorkflowStore from '../../stores/workflowStore';
import useInstanceStore from '../../stores/instanceStore';
import { generateId, now } from '../../utils/id';

const { Sider, Content } = Layout;

// Register custom node type
const nodeTypes = { stepNode: StepNode };

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { getById, addWorkflow, updateWorkflow } = useWorkflowStore();
  const { addInstance } = useInstanceStore();

  const [workflowName, setWorkflowName] = useState('');
  const [workflowDesc, setWorkflowDesc] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Load existing workflow data
  useEffect(() => {
    if (isEdit) {
      const wf = getById(id);
      if (wf) {
        setWorkflowName(wf.name);
        setWorkflowDesc(wf.description || '');
        setNodes(wf.nodes || []);
        setEdges(wf.edges || []);
      }
    }
  }, [id, isEdit, getById, setNodes, setEdges]);

  // ===== 拖拽：从 StepPalette 拖入画布 =====
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw || !reactFlowInstance) return;

      const { stepDefId, name, category, configSchema } = JSON.parse(raw);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeId = `node-${generateId()}`;
      const newNode = {
        id: nodeId,
        type: 'stepNode',
        position,
        data: {
          label: name,
          stepDefId,
          category,
          configCount: configSchema?.length || 0,
          config: {},
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  // ===== 连线 =====
  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        id: `edge-${generateId()}`,
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  // ===== 节点选中 =====
  const onNodeClick = useCallback((_event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // ===== 配置变更 =====
  const onConfigChange = useCallback(
    (nodeId, fieldName, value) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n;
          return {
            ...n,
            data: {
              ...n.data,
              config: { ...n.data.config, [fieldName]: value },
            },
          };
        })
      );
      // 同步更新 selectedNode
      setSelectedNode((prev) => {
        if (prev && prev.id === nodeId) {
          return {
            ...prev,
            data: {
              ...prev.data,
              config: { ...prev.data.config, [fieldName]: value },
            },
          };
        }
        return prev;
      });
    },
    [setNodes]
  );

  // ===== 删除节点 =====
  const onDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
      message.success('步骤已从工作流中移除');
    },
    [setNodes, setEdges]
  );

  // ===== 保存工作流 =====
  const handleSave = () => {
    if (!workflowName.trim()) {
      message.warning('请输入工作流名称');
      return;
    }
    if (nodes.length === 0) {
      message.warning('请至少添加一个步骤节点');
      return;
    }

    const wfNodes = nodes.map((n) => ({
      id: n.id,
      stepDefId: n.data.stepDefId,
      label: n.data.label,
      position: n.position,
      config: n.data.config || {},
    }));

    const wfEdges = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    }));

    if (isEdit) {
      updateWorkflow(id, {
        name: workflowName,
        description: workflowDesc,
        nodes: wfNodes,
        edges: wfEdges,
      });
      message.success('工作流已更新');
    } else {
      const newWf = addWorkflow({
        name: workflowName,
        description: workflowDesc,
        nodes: wfNodes,
        edges: wfEdges,
      });
      message.success('工作流已创建');
      navigate(`/workflows/${newWf.id}`, { replace: true });
    }
  };

  // ===== 创建实例 =====
  const handleCreateInstance = () => {
    if (!isEdit) {
      message.warning('请先保存工作流');
      return;
    }
    const wf = getById(id);
    const nodeStates = (wf?.nodes || []).map((n) => ({
      nodeId: n.id,
      status: 'pending',
    }));
    const inst = addInstance({
      workflowId: id,
      workflowName: workflowName,
      status: 'running',
      nodeStates,
    });
    message.success(`实例已创建 (${inst.id})`);
    navigate(`/instances/${inst.id}`);
  };

  return (
    <div style={{ height: 'calc(100vh - 128px)', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部工具栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/workflows')} size="small">
            返回列表
          </Button>
          <Breadcrumb items={[
            { title: <a onClick={() => navigate('/workflows')}>工作流</a> },
            { title: isEdit ? `编辑: ${workflowName}` : '新建工作流' },
          ]} />
          {isEdit && <Tag color="blue">ID: {id}</Tag>}
        </Space>

        <Space>
          <Input
            placeholder="工作流名称"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            style={{ width: 220 }}
          />
          <Input
            placeholder="描述（选填）"
            value={workflowDesc}
            onChange={(e) => setWorkflowDesc(e.target.value)}
            style={{ width: 220 }}
          />
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            保存
          </Button>
          {isEdit && (
            <Button icon={<PlayCircleOutlined />} onClick={handleCreateInstance}>
              创建实例
            </Button>
          )}
        </Space>
      </div>

      {/* 三栏布局：左侧面板 + 画布 + 右侧面板 */}
      <Layout style={{ flex: 1, background: '#f5f5f5' }}>
        {/* 左侧：步骤库面板 */}
        <Sider width={220} theme="light" style={{
          borderRight: '1px solid #e8e8e8',
          background: '#fff',
        }}>
          <StepPalette />
        </Sider>

        {/* 中间：ReactFlow 画布 */}
        <Content style={{ position: 'relative' }}>
          <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              fitView
              deleteKeyCode={['Backspace', 'Delete']}
              snapToGrid
              snapGrid={[16, 16]}
              defaultEdgeOptions={{
                style: { stroke: '#b1b1b7', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
              }}
            >
              <Background color="#e8e8e8" gap={16} />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const colors = { 'HTTP': '#1890ff', '审批': '#722ed1', '通知': '#13c2c2', '脚本': '#fa8c16', '数据处理': '#52c41a', '流程控制': '#eb2f96' };
                  return colors[node.data?.category] || '#1890ff';
                }}
                style={{ height: 120 }}
              />
            </ReactFlow>
          </div>

          {/* 画布空状态提示 */}
          {nodes.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#bbb',
              pointerEvents: 'none',
              zIndex: 0,
            }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>⟐</div>
              <div style={{ fontSize: 16 }}>从左侧拖拽步骤到此处</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>连接节点创建执行流程</div>
            </div>
          )}
        </Content>

        {/* 右侧：节点配置面板 */}
        <Sider width={320} theme="light" style={{
          borderLeft: '1px solid #e8e8e8',
          background: '#fff',
        }}>
          <WorkflowConfigPanel
            selectedNode={selectedNode}
            onConfigChange={onConfigChange}
            onDeleteNode={onDeleteNode}
          />
        </Sider>
      </Layout>
    </div>
  );
}
