import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from '../layouts/MainLayout';

// 懒加载页面
const Dashboard = lazy(() => import('../pages/Dashboard'));
const StepLibrary = lazy(() => import('../pages/StepLibrary'));
const StepEditor = lazy(() => import('../pages/StepLibrary/StepEditor'));
const DictManagement = lazy(() => import('../pages/DictManagement'));
const DictEditor = lazy(() => import('../pages/DictManagement/DictEditor'));
const WorkflowManagement = lazy(() => import('../pages/WorkflowManagement'));
const WorkflowEditor = lazy(() => import('../pages/WorkflowManagement/WorkflowEditor'));
const InstanceManagement = lazy(() => import('../pages/InstanceManagement'));
const InstanceDetail = lazy(() => import('../pages/InstanceManagement/InstanceDetail'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
    <Spin size="large" />
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(Dashboard) },
      // 步骤管理
      { path: 'steps', element: withSuspense(StepLibrary) },
      { path: 'steps/new', element: withSuspense(StepEditor) },
      { path: 'steps/:id', element: withSuspense(StepEditor) },
      // 字典管理
      { path: 'dicts', element: withSuspense(DictManagement) },
      { path: 'dicts/new', element: withSuspense(DictEditor) },
      { path: 'dicts/:id', element: withSuspense(DictEditor) },
      // 工作流管理
      { path: 'workflows', element: withSuspense(WorkflowManagement) },
      { path: 'workflows/new', element: withSuspense(WorkflowEditor) },
      { path: 'workflows/:id', element: withSuspense(WorkflowEditor) },
      // 实例管理
      { path: 'instances', element: withSuspense(InstanceManagement) },
      { path: 'instances/:id', element: withSuspense(InstanceDetail) },
      // 404
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
