import React, { useEffect } from 'react'
import { Layout } from 'antd';
import SideMenu from '../../components/sendbox/SideMenu'
import TopHeader from '../../components/sendbox/TopHeader'
import NewsRouter from '../../components/sendbox/NewsRouter'
import './NewsSendBox.css'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'

const { Content } = Layout;

export default function NewsSendBox() {
    NProgress.start();

    useEffect(() => {
        NProgress.done();
    })

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
