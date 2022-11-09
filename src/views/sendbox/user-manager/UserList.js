import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;

export default function UserList() {
    const [dataSource, setDataSource] = useState([])

    const [isAddVisible, setIsAddVisible] = useState(false)
    const [isUpdateVisible, setIsUpdateVisible] = useState(false)
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)

    const [regionList, setRegionList] = useState([])
    const [roleList, setRoleList] = useState([])

    const [current, setCurrent] = useState(null)

    const addForm = useRef(null)
    const updateForm = useRef(null)

    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
    const columns = [
        {
            title: '區域',
            dataIndex: 'region',
            filters: [
                {
                    text: "全球",
                    value: ""
                },
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                }))
            ],
            onFilter: (value, item) => item.region === value,
            render: (region) => {
                return <b>{region === "" ? "全球" : region}</b>
            }
        },
        {
            title: '角色名稱',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: '用戶名稱',
            dataIndex: 'username',
        },
        {
            title: '用戶狀態',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch
                    checked={roleState}
                    disabled={item.default}
                    onChange={() => handleChange(item)}
                />
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button
                        danger
                        shape="circle"
                        disabled={item.default}
                        icon={<DeleteOutlined />}
                        onClick={() => confirmMethod(item)}
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        disabled={item.default}
                        icon={<EditOutlined />}
                        onClick={() => handleUpdate(item)}
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

        axios.delete(`/users/${item.id}`)
    }

    function handleChange(item) {
        item.roleState = !item.roleState

        setDataSource([...dataSource])

        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    function handleUpdate(item) {
        setIsUpdateVisible(true)

        if (item.roleId === 1) {
            setIsUpdateDisabled(true)
        } else {
            setIsUpdateDisabled(false)
        }

        setTimeout(() => {
            updateForm.current.setFieldsValue(item)
        }, 1)

        setCurrent(item)
    }

    function addFormOK() {
        addForm.current.validateFields().then(value => {
            setIsAddVisible(false)

            addForm.current.resetFields()

            //post 後端並生成 ID，再設置 DataSource 方便後續資料更新與刪除
            axios.post("/users", {
                ...value,
                "roleState": true,
                "default": false,
            }).then(res => {
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList
                        .filter(item => item.id === value.roleId)[0]
                }])
            }).catch(err => {
                console.log(err)
            })
        })
    }

    function updateFormOK() {
        updateForm.current.validateFields().then(value => {
            setIsUpdateVisible(false)

            setDataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList
                            .filter(data => data.id === value.roleId)[0]
                    }
                }
                return item
            }))

            axios.patch(`/users/${current.id}`, value)
        })
    }

    useEffect(() => {
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }

        axios.get("/users?_expand=role").then(res => {
            const list = res.data
            setDataSource(roleObj[roleId] === "superadmin" ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region &&
                    roleObj[item.roleId] === "editor")
            ]);
        })
    }, [roleId, region, username])

    useEffect(() => {
        axios.get("/regions").then(res => {
            setRegionList(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get("/roles").then(res => {
            setRoleList(res.data);
        })
    }, [])

    return (
        <div>
            <Button
                type='primary'
                onClick={() => {
                    setIsAddVisible(true)
                }}
            >
                新增用戶
            </Button>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
                rowKey={(item) => item.id}
            />
            <Modal
                open={isAddVisible}
                title="新增用戶"
                okText="確認"
                cancelText="取消"
                onCancel={() => {
                    setIsAddVisible(false)
                }}
                onOk={() => addFormOK()}
            >
                <UserForm
                    regionList={regionList}
                    roleList={roleList}
                    ref={addForm}
                />
            </Modal>
            <Modal
                open={isUpdateVisible}
                title="更新用戶"
                okText="確認"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateVisible(false)
                }}
                onOk={() => updateFormOK()}
            >
                <UserForm
                    regionList={regionList}
                    roleList={roleList}
                    ref={updateForm}
                    isUpdate={true}
                    isUpdateDisabled={isUpdateDisabled}
                />
            </Modal>
        </div>
    )
}
