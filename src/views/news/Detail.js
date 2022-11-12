import React, { useState, useEffect } from 'react'
import { useMatch } from "react-router-dom";
import axios from 'axios'
import moment from 'moment'
import { Descriptions, PageHeader } from 'antd';
import { HeartTwoTone } from '@ant-design/icons'

export default function NewsPreview() {
    const [newsInfo, setNewsInfo] = useState(null)
    const { params: { id } } = useMatch('/detail/:id')

    function handleStar() {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })

        axios.patch(`/news/${id}?_expand=category&_expand=role`, {
            star: newsInfo.star + 1
        })
    }

    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1
            })

            return res.data
        }).then(res => {
            axios.patch(`/news/${id}?_expand=category&_expand=role`, {
                view: res.view + 1
            })
        })
    }, [id])

    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                <span
                                    style={{ paddingRight: '12px' }}
                                >
                                    {newsInfo.category.title}
                                </span>
                                <HeartTwoTone
                                    twoToneColor="#eb2f96"
                                    onClick={() => handleStar()}
                                />
                            </div>
                        }
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="作者">
                                {newsInfo.author}
                            </Descriptions.Item>
                            <Descriptions.Item label="發布時間">
                                {
                                    newsInfo.publishTime ? moment(newsInfo.publishTime)
                                        .format("YYYY/MM/DD HH:mm:ss") : "-"
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="區域">
                                {newsInfo.region}
                            </Descriptions.Item>
                            <Descriptions.Item label="瀏覽人次">
                                {newsInfo.view}
                            </Descriptions.Item>
                            <Descriptions.Item label="點讚數量">
                                {newsInfo.star}
                            </Descriptions.Item>
                            <Descriptions.Item label="評論數量">
                                0
                            </Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: newsInfo.content
                        }}
                        style={{
                            margin: "0 24px",
                            padding: "12px 24px",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>
            }
        </div>
    )
}
