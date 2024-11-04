'use client';

import { AreaChartOutlined, HomeOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout';
import Menu from 'antd/es/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const { Content, Footer, Sider } = Layout;

enum MENU_ITEM_NAME {
  HOME = 'Home',
  ECOMMERCE_DASHBOARD = 'Ecommerce',
}

const MENU_ITEMS_CONFIG = [
  {
    icon: HomeOutlined,
    name: MENU_ITEM_NAME.HOME,
    route: '/home',
  },
  {
    icon: AreaChartOutlined,
    name: MENU_ITEM_NAME.ECOMMERCE_DASHBOARD,
    route: '/ecommerce',
  },
];

const MENU_ITEMS = MENU_ITEMS_CONFIG.map((iconInfo) => ({
  icon: React.createElement(iconInfo.icon),
  key: iconInfo.name,
  label: <Link href={iconInfo.route}>{iconInfo.name}</Link>,
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: Props): React.ReactNode {
  const pathname = usePathname();
  const initialSelectedMenuItem = MENU_ITEMS_CONFIG.find(
    ({ route }) => route === pathname
  );
  const initialRoute = initialSelectedMenuItem?.name ?? '';

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider collapsible width={250}>
        <Menu
          defaultSelectedKeys={[initialRoute]}
          items={MENU_ITEMS}
          mode='inline'
          theme='dark'
        />
      </Sider>
      <Layout>
        <Content style={{ padding: '16px 16px 0px 16px' }}>
          <main style={{ padding: 16 }}>{children}</main>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Shoot for the moon © 2024 Scout AI
        </Footer>
      </Layout>
    </Layout>
  );
}
