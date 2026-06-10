import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, theme as antTheme } from 'antd';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  BookOutlined,
  ApartmentOutlined,
  ProfileOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/steps', icon: <ThunderboltOutlined />, label: '步骤库' },
  { key: '/dicts', icon: <BookOutlined />, label: '字典管理' },
  { key: '/workflows', icon: <ApartmentOutlined />, label: '工作流' },
  { key: '/instances', icon: <ProfileOutlined />, label: '实例列表' },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = antTheme.useToken();

  const selectedKey = '/' + location.pathname.split('/')[1];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={200}
      >
        <div style={{
          height: 48,
          margin: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 16 : 18,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}>
          {collapsed ? 'WF' : 'Workflow 管理'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: token.colorBgContainer,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          fontSize: 16,
          fontWeight: 500,
        }}>
          工作流编排管理系统
        </Header>
        <Content style={{ margin: 16, overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
