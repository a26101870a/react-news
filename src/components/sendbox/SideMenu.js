import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux';
import axios from 'axios'
import { Layout, Menu } from 'antd'
import {
    HomeFilled,
    UserOutlined,
    ProfileOutlined,
    SettingOutlined,
    UnlockFilled,
    ReadFilled,
    EditOutlined,
    InboxOutlined,
    FolderOutlined,
    ContainerFilled,
    CheckCircleFilled,
    CloudUploadOutlined,
    CloudDownloadOutlined,
    GlobalOutlined
} from '@ant-design/icons'

import './index.css'

const { Sider } = Layout;

const iconList = {
    '/home': <HomeFilled />,
    '/user-manage': <UserOutlined />,
    '/user-manage/list': <ProfileOutlined />,
    '/right-manage': <SettingOutlined />,
    '/right-manage/role/list': <ProfileOutlined />,
    '/right-manage/right/list': <UnlockFilled />,
    '/news-manage': <ReadFilled />,
    '/news-manage/add': <EditOutlined />,
    '/news-manage/draft': <InboxOutlined />,
    '/news-manage/category': <FolderOutlined />,
    '/audit-manage': <FolderOutlined />,
    '/audit-manage/audit': <ContainerFilled />,
    '/audit-manage/list': <ProfileOutlined />,
    '/publish-manage': <ProfileOutlined />,
    '/publish-manage/unpublished': <CloudUploadOutlined />,
    '/publish-manage/published': <CheckCircleFilled />,
    '/publish-manage/sunset': <CloudDownloadOutlined />,
}

function SideMenu(props) {
    const [menu, setMenu] = useState([]);
    const navigate = useNavigate();
    let location = useLocation();

    const { role: { rights } } = JSON.parse(localStorage.getItem('token'));

    const selectKeys = [location.pathname];
    const openKeys = ['/' + location.pathname.split('/')[1]];

    const titleName = '全球新聞發布管理系統';

    function navigateEvent(e) {
        navigate(e.key);
    };

    /**
     * Fisrt, check the menu item whether have page permission,
     * if not, retrun false.
     * Second, check the path of the menu item whether meet user's right path,
     * if not, return false.
     * If both of them are true, then render the menu item. */
    function checkPagePermission(item) {
        return item.pagepermission && rights.includes(item.key)
    }

    function renderMenu(menuList) {
        const array = []

        // eslint-disable-next-line array-callback-return
        menuList.map(item => {
            //if item has children, keeps rendering its children
            if (item.children?.length > 0 &&
                checkPagePermission(item)) {
                array.push(
                    getItem(
                        item.key,
                        iconList[item.key],
                        item.title,
                        renderMenu(item.children)
                    ))
            } else {
                checkPagePermission(item) &&
                    array.push(
                        getItem(
                            item.key,
                            iconList[item.key],
                            item.title,
                        ))
            }
        })

        return array
    }

    //get route data
    useEffect(() => {
        axios.get('/rights?_embed=children').then(
            res => {
                setMenu(renderMenu(res.data))
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={props.isCollapsed}
        >
            <div className='sideMenu'>
                <div className='logo'>
                    {props.isCollapsed ? <GlobalOutlined /> : titleName}
                </div>
                <div className='flex'>
                    <Menu
                        onClick={navigateEvent}
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}
                        mode='inline'
                        theme='dark'
                        items={menu}
                    />
                </div>
            </div>
        </Sider>
    )
}

function getItem(key, icon, label, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
    isCollapsed
})

export default connect(mapStateToProps)(SideMenu)