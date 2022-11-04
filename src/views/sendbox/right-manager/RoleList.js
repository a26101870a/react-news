import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined,
    UnorderedListOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons'

const { confirm } = Modal;

export default function RoleList() {
    const [dataSource, setDataSource] = useState([])
    const [rightsList, setRightsList] = useState([])
    const [currentRights, setCurrentRights] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名稱',
            dataIndex: 'roleName',
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
                        type="primary"
                        shape="circle"
                        icon={<UnorderedListOutlined />}
                        onClick={() => {
                            setIsModalOpen(true)
                            setCurrentRights(item.rights)
                            setCurrentId(item.id)
                        }}
                    />
                </div>
            }
        },
    ]

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
        axios.delete(`http://localhost:8000/roles/${item.id}`)
    }


    useEffect(() => {
        axios.get("http://localhost:8000/roles").then(res => {
            setDataSource(res.data);
        })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:8000/rights?_embed=children").then(res => {
            setRightsList(res.data);
        })
    }, [])

    function handleOk() {
        setIsModalOpen(false)

        //同步 datasource
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        //pathch
        axios.patch(`http://localhost:8000/roles/${currentId}`, {
            rights: currentRights
        })

    }

    function handleCancel() {
        setIsModalOpen(false)
    }

    function onCheck(checkedKeys) {
        setCurrentRights(checkedKeys.checked)
    };

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(item) => item.id}
            />

            <Modal
                title="權限分配"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Tree
                    checkable
                    checkStrictly={true}
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    treeData={rightsList}
                />
            </Modal>
        </div>
    )
}
