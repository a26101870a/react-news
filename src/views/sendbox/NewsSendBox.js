import React from 'react'
import { Layout } from 'antd';
import SideMenu from '../../components/sendbox/SideMenu'
import TopHeader from '../../components/sendbox/TopHeader'
import NewsRouter from '../../components/sendbox/NewsRouter'
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
                    <NewsRouter />
                </Content>
            </Layout>
        </Layout>
    )
}
