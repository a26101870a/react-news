import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { Table, Tag, Button, notification } from 'antd'
import axios from 'axios'

export default function AuditList() {
    const [dataSource, setDataSource] = useState([])
    const navigate = useNavigate()
    const { username } = JSON.parse(localStorage.getItem("token"))

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
            title: '審核狀態',
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ["", "orange", "green", "red"]
                const auditList = ["草稿箱", "審核中", "已通過", "未通過"]
                return <Tag
                    color={colorList[auditState]}
                >
                    {auditList[auditState]}
                </Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 &&
                        <Button
                            onClick={() => {
                                handleRevert(item)
                            }}
                        >
                            撤銷
                        </Button>
                    }
                    {
                        item.auditState === 2 &&
                        <Button
                            danger
                            onClick={() => {
                                handlePublish(item)
                            }}
                        >
                            發布
                        </Button>
                    }
                    {
                        item.auditState === 3 &&
                        <Button
                            type='primary'
                            onClick={() => {
                                handleUpdate(item)
                            }}
                        >
                            修改
                        </Button>
                    }
                </div>
            }
        },
    ];

    function handleRevert(item) {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(() => {
            notification.info({
                message: "通知",
                description:
                    `您可以到草稿箱中查看您的新聞。`,
                placement: 'bottomRight',
            })
        })
    }

    function handlePublish(item) {
        axios.patch(`/news/${item.id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        })
            .then(() => {
                navigate('/publish-manage/published')

                notification.info({
                    message: "通知",
                    description:
                        `您可以到 [發布管理/已發布] 中查看您的新聞。`,
                    placement: 'bottomRight',
                })
            })
    }

    function handleUpdate(item) {
        navigate(`/news-manage/update/${item.id}`)
    }

    useEffect(() => {
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
            .then(res => {
                setDataSource(res.data);
            })
    }, [username])

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
