import React, { useEffect } from 'react'
import { Layout } from 'antd';
import NProgress from 'nprogress';

import SideMenu from '../../components/sendbox/SideMenu'
import TopHeader from '../../components/sendbox/TopHeader'
import NewsRouter from '../../components/sendbox/NewsRouter'

import './NewsSendBox.css'
import 'nprogress/nprogress.css'

const { Content } = Layout;

export default function NewsSendBox() {
    //progress bar starts
    NProgress.start();

    useEffect(() => {
        NProgress.done();
    })

    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content className="site-layout-background content" >
                    <NewsRouter />
                </Content>
            </Layout>
        </Layout>
    )
}
