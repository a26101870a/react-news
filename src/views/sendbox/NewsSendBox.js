import React from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/sendbox/SideMenu'
import TopHeader from '../../components/sendbox/TopHeader'
import { Layout } from 'antd';
import './NewsSendBox.css'

const { Content } = Layout;

export default function NewsSendBox() {
    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}
