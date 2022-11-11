
import React, { useState, useEffect } from 'react'
import { Table, Button, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal;

export default function NewsDraft() {
    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新聞標題',
            dataIndex: 'title',
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新聞分類',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button
                        danger
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)}
                    />
                    <Button
                        shape="circle"
                        icon={<EditOutlined />}
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<UploadOutlined />}
                    />
                </div>
            }
        },
    ];

    function confirmMethod(item) {
        confirm({
            title: '您確定要刪除此選項嗎?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
            },
        });
    }

    function deleteMethod(item) {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
    }

    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
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
