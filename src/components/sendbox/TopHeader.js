import React, { useState } from 'react'
import { Layout, Dropdown, Avatar } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';


const { Header } = Layout;

export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false);

    const items = [
        { label: '超級管理員', key: '1' }, // 菜单项务必填写 key
        { label: '登出', danger: true, key: '2' },
    ];

    function changeCollapsed() {
        setCollapsed(!collapsed)
    }

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
            })} */}
            {
                collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> :
                    <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: 'right' }}>
                <span style={{ paddingRight: '16px' }}>歡迎 Admin 回來</span>
                <Dropdown menu={{ items }}>
                    <Avatar icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
