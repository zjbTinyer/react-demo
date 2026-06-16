# Workflow 管理系统

基于 **React 19 + Ant Design 5 + ReactFlow + Zustand** 构建的灵活工作流编排管理系统。

## 快速启动

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`

## 技术栈

| 包 | 用途 |
|---|---|
| `react` + `react-dom` ^19 | 核心框架 |
| `antd` + `@ant-design/icons` | UI 组件库 |
| `react-router-dom` v6 | 前端路由 |
| `zustand` | 轻量状态管理 + localStorage 持久化 |
| `@reactflow/core` + 子包 | 拖拽编排画布（Workflow Editor） |
| `uuid` | 唯一 ID 生成 |

## 业务模型

### 核心实体

```
StepDefinition ──── 步骤类型模板
    │  └── configSchema: ConfigField[]   ← 定义有哪些配置字段
    │  └── category: 分类标签             ← 用于筛选 (HTTP/审批/通知/脚本/…)
    │
    ▼
Workflow ──── 工作流 = 步骤节点 + 连线
    │  └── WorkflowNode[]   ← 每个节点引用一个 StepDefinition + 填入具体配置
    │  └── WorkflowEdge[]   ← 定义执行顺序（DAG）
    │
    ▼
WorkflowInstance ──── 工作流实例 (case)
       └── nodeStates[]    ← 每个节点的执行状态和结果
```

### 配置字段的三种值来源

每个 Step 的 configSchema 由若干 ConfigField 组成，每个字段的值来源可以是：

| valueType | 说明 | 渲染控件 |
|-----------|------|---------|
| `fixed` | 固定值 | Input / InputNumber / Select (预定义选项) |
| `list` | 固定列表 | Select mode="tags" 标签输入 |
| `dict` | 引用字典数据 | DictRefSelect — 从指定字典的指定列中选择值 |

### Dict（字典）

结构化数据表，如"用户表"有列 `[id, name, email, department]` 和数据行。Step 配置中 `valueType: 'dict'` 的字段可引用字典的某列数据作为下拉选项。

## 目录结构

```
src/
├── main.jsx                          # 入口
├── App.jsx                           # 路由容器
├── index.css                         # 全局样式
│
├── types/index.js                    # JSDoc 类型定义
├── utils/id.js                       # UUID 生成工具
│
├── router/index.jsx                  # 懒加载路由配置
├── layouts/MainLayout.jsx            # 侧边栏 + 顶栏全局布局
│
├── mock/                             # 预置模拟数据
│   ├── steps.js                      # 6 个步骤类型
│   ├── dicts.js                      # 3 个字典表
│   ├── workflows.js                  # 2 个示例工作流
│   └── instances.js                  # 3 个历史实例
│
├── stores/                           # Zustand + localStorage 持久化
│   ├── stepStore.js                  # StepDefinition CRUD
│   ├── dictStore.js                  # Dict CRUD + 行列操作
│   ├── workflowStore.js              # Workflow CRUD
│   └── instanceStore.js              # WorkflowInstance CRUD
│
├── components/                       # 核心通用组件
│   ├── DynamicConfigForm.jsx         # ★ 根据 ConfigSchema 动态渲染表单
│   ├── DictRefSelect.jsx             # ★ 字典引用下拉选择器
│   ├── StepNode.jsx                  # ReactFlow 自定义节点 (分类图标+颜色)
│   ├── StepPalette.jsx               # 左侧拖拽面板 (分类筛选+搜索)
│   ├── WorkflowConfigPanel.jsx       # 右侧节点配置面板
│   └── ConfirmDelete.jsx             # 删除确认弹窗
│
└── pages/
    ├── Dashboard/index.jsx           # 仪表盘: 统计卡片 + 快捷入口
    ├── StepLibrary/
    │   ├── index.jsx                 # 步骤库列表 (搜索+分类筛选)
    │   └── StepEditor.jsx            # 步骤类型编辑 (定义 configSchema)
    ├── DictManagement/
    │   ├── index.jsx                 # 字典列表
    │   └── DictEditor.jsx            # 字典编辑 (列定义 + 数据行管理)
    ├── WorkflowManagement/
    │   ├── index.jsx                 # 工作流列表
    │   └── WorkflowEditor.jsx        # ★ 拖拽编排画布 (核心页面)
    └── InstanceManagement/
        ├── index.jsx                 # 实例列表 (按状态+工作流筛选)
        └── InstanceDetail.jsx        # 实例详情 (节点执行状态时间线)
```

## 路由

| 路径 | 页面 |
|------|------|
| `/` | 仪表盘 |
| `/steps` | 步骤库列表 |
| `/steps/new` | 新建步骤类型 |
| `/steps/:id` | 编辑步骤类型 |
| `/dicts` | 字典列表 |
| `/dicts/new` | 新建字典 |
| `/dicts/:id` | 编辑字典 |
| `/workflows` | 工作流列表 |
| `/workflows/new` | 新建工作流 (编辑器) |
| `/workflows/:id` | 编辑工作流 (编辑器) |
| `/instances` | 实例列表 |
| `/instances/:id` | 实例详情 |

## 页面布局

```
┌──────────────────────────────────────────────────────┐
│  Header                                          [侧]│
├──────────────────┬───────────────────┬───────────────┤
│  Step            │                   │  Config       │
│  Palette         │  ReactFlow Canvas │  Panel        │
│                  │                   │               │
│  [分类筛选]      │  [Node]──[Node]  │  选中节点的    │
│  [搜索步骤]      │     │      │      │  配置表单      │
│  ┌────────┐      │     │      │      │  ┌─────────┐  │
│  │Step A  │      │  [Node]──[Node]  │  │字段1: ▢ │  │
│  │Step B  │      │                   │  │字段2: ▼ │  │
│  │Step C  │      │  (从左侧拖入)     │  │字段3: ✚ │  │
│  └────────┘      │                   │  └─────────┘  │
│                  │                   │               │
└──────────────────┴───────────────────┴───────────────┘
```

## 核心设计

### 1. 动态表单渲染

`DynamicConfigForm` 根据 StepDefinition 的 `configSchema` 动态生成 Ant Design 表单控件：

- `valueType === 'fixed'` → Input / Select / InputNumber（根据 dataType 和 options）
- `valueType === 'list'` → Select mode="tags"
- `valueType === 'dict'` → DictRefSelect（从 dictStore 获取数据）

### 2. 字典引用数据流

```
DictManagement (管理表结构和数据)
  → dictStore (Zustand persist → localStorage)
    → DictRefSelect (读取 dict 数据填充下拉选项)
      → DynamicConfigForm (嵌入 DictRefSelect)
        → WorkflowConfigPanel (选中节点时展示表单)
          → WorkflowEditor (更新节点 config)
```

### 3. 拖拽编排

- **onDragStart**（StepPalette 中的 Card）：`event.dataTransfer.setData('application/reactflow', ...)`
- **onDrop**（画布）：读取 transfer data，创建新的 ReactFlow Node
- **onConnect**（连线）：从一个 handle 拖到另一个 handle 建立 Edge
- 画布支持：缩放、平移、网格对齐、Minimap 小地图

### 4. 数据持久化

所有 Zustand store 使用 `persist` 中间件，自动同步到 localStorage：

- `workflow-steps` — 步骤类型
- `workflow-dicts` — 字典
- `workflow-workflows` — 工作流
- `workflow-instances` — 实例

Mock 数据在首次加载时写入（检查 localStorage 是否为空）。

## 预置数据

### 步骤类型 (6 个)

| 名称 | 分类 | 配置字段 |
|------|------|---------|
| HTTP 请求 | HTTP | url, method, headers, timeout |
| 审批节点 | 审批 | approver(dict), timeout, notifyType, ccUsers(dict) |
| 发送通知 | 通知 | channel, recipients(dict), templateId |
| 脚本执行 | 脚本 | scriptType, environment(dict), scriptContent, args |
| 数据转换 | 数据处理 | transformType, sourceField, targetField, mappingRules |
| 条件判断 | 流程控制 | field, operator, compareValue |

### 字典表 (3 个)

- **用户表** — 6 条数据，列为 id/name/email/department
- **环境表** — 5 条数据，列为 id/name/host/region
- **部门表** — 4 条数据，列为 id/name/manager

### 示例工作流 (2 个)

- **请假审批流程** — 主管审批 → 通知 HR + 请假天数判断（3 个节点，2 条连线）
- **数据同步流程** — 拉取外部数据 → JSON 转换（2 个节点，1 条连线）

## 构建与部署

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm run preview   # 预览构建产物
```

### Vercel 部署

🔗 **预览地址**: [https://react-demo-7erd9wjj6-zjbtinyers-projects.vercel.app](https://react-demo-7erd9wjj6-zjbtinyers-projects.vercel.app)

```bash
# CLI 部署
vercel deploy --scope zjbtinyers-projects -y --no-wait
```
