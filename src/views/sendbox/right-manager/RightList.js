import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal;

export default function RightList() {
    const [dataSource, setDataSource] = useState([])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '權限名稱',
            dataIndex: 'label',
        },
        {
            title: '權限路徑',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle"
                        icon={<DeleteOutlined
                            onClick={() => confirmMethod(item)}
                        />} />

                    <Popover
                        content={
                            <div
                                style={{ textAlign: "center" }}
                            >
                                <Switch
                                    checked={item.pagepermisson}
                                    onClick={() => switchMethod(item)}
                                />
                            </div>
                        }
                        title="配置項目"
                        trigger={item.pagepermisson === undefined ? "" : "click"}
                    >
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            disabled={item.pagepermisson === undefined}
                        />
                    </Popover>
                </div>
            }
        },
    ];

    function switchMethod(item) {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1

        setDataSource([...dataSource])

        if (item.grade === 1) {
            axios.patch(`http://localhost:8000/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`http://localhost:8000/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }

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

        //當前頁面同步狀態 + 後端同步
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id))

            axios.delete(`http://localhost:8000/rights/${item.id}`)
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)

            list[0].children = list[0].children.filter(data => data.id !== item.id)

            setDataSource([...dataSource])

            axios.delete(`http://localhost:8000/children/${item.id}`)
        }
    }

    useEffect(() => {
        axios.get("http://localhost:8000/rights?_embed=children").then(res => {
            const list = res.data

            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ""
                }
            });

            setDataSource(res.data);
        })
    }, [])

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
            />
        </div>
    )
}
