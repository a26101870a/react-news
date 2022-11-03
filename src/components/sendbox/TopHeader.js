import React, { useState } from 'react'
import { Layout } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';


const { Header } = Layout;

export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
            })} */}
            {
                collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
        </Header>
    )
}
