import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Dropdown, Avatar } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';


const { Header } = Layout;

export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))

    const items = [
        { label: roleName, key: '1' },
        { label: '登出', danger: true, key: '2' },
    ];

    function changeCollapsed() {
        setCollapsed(!collapsed)
    }

    function onClick({ key }) {
        if (key === "2") {
            localStorage.removeItem("token")
            navigate("/login")
        }
    };

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
                <span style={{ paddingRight: '16px' }}>歡迎 {username} 回來</span>
                <Dropdown menu={{ items, onClick }}>
                    <Avatar icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
