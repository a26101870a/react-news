import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';

import Particles from 'react-particles';
import { loadFull } from 'tsparticles';
import Options from './particles.json';

import './Login.css';

const errorMessage = '用戶名稱不存在或是密碼錯誤';
const titleName = '全球新聞發布管理系統';
const loginButtonName = '登入';

export default function Login() {
    const navigate = useNavigate();

    /* Receive the information the user submit,
    ** and check the information is a valid user from database. */
    function onFinish(values) {
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
            .then(res => { checkUserIsValid(res) })
    }

    function checkUserIsValid(res) {
        if (res.data.length === 0) {
            //Login Failed
            message.error(errorMessage)
        } else {
            //store user infomation to render the page and navigate to homepage
            localStorage.setItem('token', JSON.stringify(res.data[0]))
            navigate('/')
        }
    }

    const particlesInit = useCallback(async engine => {
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        return 0
    }, []);

    return (
        <div className='login_container'>
            <Particles
                id='tsparticles'
                init={particlesInit}
                loaded={particlesLoaded}
                options={Options}
            />
            <div className='formContainer'>
                <div className='login_title'>{titleName}</div>
                <Form
                    name='normal_login'
                    className='login-form'
                    onFinish={onFinish}
                >
                    <Form.Item
                        name='username'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className='site-form-item-icon' />}
                            type='password'
                            placeholder='Password'
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' className='login-form-button'>
                            {loginButtonName}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
