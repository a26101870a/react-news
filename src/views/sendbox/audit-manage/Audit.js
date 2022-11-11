import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { Table, Tag, Button, notification } from 'antd'
import axios from 'axios'

export default function Audit() {
    const [dataSource, setDataSource] = useState([])

    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

    const columns = [
        {
            title: '新聞標題',
            dataIndex: 'title',
            render: (title, item) => {
                return <Link to={`/news-manage/preview/${item.id}`}>
                    {title}
                </Link>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新聞分類',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            handleAudit(item, 2, 1)
                        }}
                    >
                        通過
                    </Button>
                    <Button
                        danger
                        onClick={() => {
                            handleAudit(item, 3, 0)
                        }}
                    >
                        拒絕
                    </Button>
                </div>
            }
        },
    ];

    function handleAudit(item, auditState, publishState) {
        setDataSource(dataSource.filter(data => data.id !== item.id))

        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
        }).then(() => {
            notification.info({
                message: "通知",
                description:
                    `您可以到 [審核管理/審核列表] 中查看您的新聞審核狀態。`,
                placement: 'bottomRight',
            })
        })
    }

    useEffect(() => {
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }

        axios(`/news?auditState=1&_expand=category`)
            .then(res => {
                const list = res.data
                setDataSource(roleObj[roleId] === "superadmin" ? list : [
                    ...list.filter(item => item.author === username),
                    ...list.filter(item => item.region === region &&
                        roleObj[item.roleId] === "editor")
                ]);
            })
    }, [roleId, region, username])

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
                rowKey={item => item.id}
            />
        </div>
    )
}
