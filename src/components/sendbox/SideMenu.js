import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from "axios"
import { Layout, Menu } from 'antd'
import {
    HomeFilled,
    UserOutlined,
    ProfileOutlined,
    SettingOutlined,
    UnlockFilled
} from '@ant-design/icons'
import './index.css'

const { Sider } = Layout;

const iconList = {
    "/home": <HomeFilled />,
    "/user-manage": <UserOutlined />,
    "/user-manage/list": <ProfileOutlined />,
    "/right-manage": <SettingOutlined />,
    "/right-manage/role/list": <UserOutlined />,
    "/right-manage/right/list": <UnlockFilled />,
}

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

export default function SideMenu() {
    const [collapsed] = useState(false);
    const [menu, setMenu] = useState([]);

    const navigate = useNavigate()
    let location = useLocation();

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    const selectKeys = [location.pathname]
    const openKeys = ["/" + location.pathname.split("/")[1]]

    function onClick(e) {
        navigate(e.key);
    };

    function checkPagePermission(item) {
        return item.pagepermission && rights.includes(item.key)
    }

    function renderMenu(menuList) {
        const array = []

        // eslint-disable-next-line array-callback-return
        menuList.map(item => {
            if (item.children?.length > 0 &&
                checkPagePermission(item)) {
                array.push(
                    getItem(
                        item.title,
                        item.key,
                        iconList[item.key],
                        renderMenu(item.children)
                    ))
            } else {
                checkPagePermission(item) &&
                    array.push(
                        getItem(
                            item.title,
                            item.key,
                            iconList[item.key],
                        ))
            }
        })

        return array
    }

    useEffect(() => {
        axios.get("/rights?_embed=children").then(
            res => {
                setMenu(renderMenu(res.data))
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
                <div className="logo">全球新聞發布管理系統</div>
                <div style={{ flex: 1, "overflow": "auto" }}>
                    <Menu
                        onClick={onClick}
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}
                        mode="inline"
                        theme='dark'
                        items={menu}
                    />
                </div>
            </div>
        </Sider>
    )
}
