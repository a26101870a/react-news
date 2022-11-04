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

    const selectKeys = [location.pathname]
    const openKeys = ["/" + location.pathname.split("/")[1]]

    const onClick = (e) => {
        navigate(e.key);
    };

    const checkPagePermission = (list) => {
        const array = []

        list.map(item => {
            if (item.children?.length) {
                array.push(
                    getItem(
                        item.title,
                        item.key,
                        iconList[item.key],
                        checkPagePermission(item.children)
                    ))
            } else {
                item["pagepermisson"] &&
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
        axios.get("http://localhost:8000/rights?_embed=children").then(
            res => {
                setMenu(checkPagePermission(res.data))
            }
        )
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
