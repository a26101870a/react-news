import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useMatch } from 'react-router-dom'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd';
import axios from 'axios'
import style from './News.module.css'
import NewsEditor from '../../../components/news-manage/NewsEditor';

export default function NewsUpdate() {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])

    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState("")

    const { params: { id } } = useMatch('/news-manage/update/:id')

    const NewsForm = useRef(null)
    const navigate = useNavigate()

    const items = [
        {
            title: '基本資訊',
            description: "新聞標題、新聞分類"
        },
        {
            title: '新聞內容',
            description: "新聞主體內容"
        },
        {
            title: '新聞提交',
            description: "保存草稿或提交審核"
        }
    ]

    let categoryOptions = []

    function handelNext() {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setFormInfo(res)
                setCurrent(prevCurrent => prevCurrent + 1)
            }).catch(err => {
                console.log(err)
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新聞內容不得為空")
            } else {
                setCurrent(prevCurrent => prevCurrent + 1)
            }
        }
    }

    function handelPrevious() {
        setCurrent(prevCurrent => prevCurrent - 1)
    }

    function createCategoryOptions() {
        const tmp_categoryOptions = []

        categoryList.map(item => {

            let optionObject = {
                value: item.id,
                label: item.title,
            }

            tmp_categoryOptions.push(optionObject)

            return 0
        })

        return tmp_categoryOptions
    }

    function handleSave(auditState) {

        axios.patch(`/news/${id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        })
            .then(() => {
                auditState === 0 ?
                    navigate('/news-manage/draft') :
                    navigate('/audit-manage/list')

                notification.info({
                    message: "通知",
                    description:
                        `您可以到${auditState === 0 ? "草稿箱" : "審核列表"}中查看您的新聞。`,
                    placement: 'bottomRight',
                })
            })
    }

    useEffect(() => {
        axios.get("/categories").then(res => {
            setCategoryList(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {

            let { title, categoryId, content } = res.data

            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })

            setContent(content)
        })
    }, [id])

    categoryOptions = createCategoryOptions()

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="編輯新聞"
                onBack={() => window.history.back()}
            />
            <Steps
                current={current}
                items={items}
            />
            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        ref={NewsForm}
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                    >
                        <Form.Item
                            label="新聞標題"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: '請輸入新聞標題',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新聞分類"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: '請選擇新聞分類',
                                },
                            ]}
                        >
                            <Select
                                options={categoryOptions}
                            />
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor
                        getContent={(value) => {
                            setContent(value);
                        }}
                        content={content}
                    />
                </div>
                <div className={current === 2 ? '' : style.active}></div>
            </div>

            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 &&
                    <span>
                        <Button
                            type='primary'
                            onClick={() => handleSave(0)}
                        >
                            保存草稿
                        </Button>
                        <Button
                            danger
                            onClick={() => handleSave(1)}
                        >
                            提交審核
                        </Button>
                    </span>
                }
                {
                    current < 2 &&
                    <Button
                        type='primary'
                        onClick={handelNext}
                    >
                        下一步
                    </Button>
                }
                {
                    current > 0 &&
                    <Button
                        onClick={handelPrevious}
                    >
                        上一步
                    </Button>
                }
            </div>
        </div>
    )
}
