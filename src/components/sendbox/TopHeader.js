import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Dropdown, Avatar } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props) {
    const navigate = useNavigate()
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))

    const items = [
        { label: roleName, key: '1' },
        { label: '登出', danger: true, key: '2' },
    ];

    function changeCollapsed() {
        props.changeCollapsed()
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
                props.isCollapsed ?
                    <MenuUnfoldOutlined onClick={changeCollapsed} /> :
                    <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: 'right' }}>
                <span style={{ paddingRight: '16px' }}>
                    歡迎&nbsp;
                    <span style={{ color: '#1890ff' }}>
                        {username}
                    </span>
                    &nbsp;回來
                </span>
                <Dropdown menu={{ items, onClick }}>
                    <Avatar icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)

/**
 * connect(
 * 
 * mapStateToProps
 * mapDispatchToProps
 * 
 * )(被包裝的組件)
 */