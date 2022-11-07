import React, { useState, useEffect, forwardRef } from 'react'
import { Form, Input, Select } from 'antd'

const UserForm = forwardRef(({ regionList, roleList, isUpdateDisabled }, ref) => {
    const [isDisabled, setIsDisabled] = useState(false)

    let regionOptions = []
    let roleOptions = []

    function createRegionOptions() {
        const tmp_regionOptions = []

        regionList.map(item => {

            let optionObject = {
                value: item.value,
                label: item.title,
            }

            tmp_regionOptions.push(optionObject)

            return 0
        })

        return tmp_regionOptions
    }

    function createRoleOptions() {
        const tmp_roleOptions = []

        roleList.map(item => {

            let optionObject = {
                value: item.id,
                label: item.roleName,
            }

            tmp_roleOptions.push(optionObject)

            return 0
        })

        return tmp_roleOptions
    }

    useEffect(() => {
        setIsDisabled(isUpdateDisabled)
    }, [isUpdateDisabled])


    regionOptions = createRegionOptions()
    roleOptions = createRoleOptions()

    return (
        <Form
            layout="vertical"
            ref={ref}
        >
            <Form.Item
                name="username"
                label="用戶名稱"
                rules={[
                    {
                        required: true,
                        message: '請輸入用戶名稱',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密碼"
                rules={[
                    {
                        required: true,
                        message: '請輸入密碼',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="區域"
                rules={isDisabled ? [] : [
                    {
                        required: true,
                        message: '請選擇負責區域',
                    },
                ]}
            >
                <Select
                    options={regionOptions}
                    disabled={isDisabled}
                />
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '請選擇角色',
                    },
                ]}
            >
                <Select
                    options={roleOptions}
                    onChange={(value) => {
                        if (value === 1) {
                            setIsDisabled(true)
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        } else {
                            setIsDisabled(false)
                        }
                    }}
                />
            </Form.Item>
        </Form>
    )
})

export default UserForm