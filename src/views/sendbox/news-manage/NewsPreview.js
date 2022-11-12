import React, { useState, useEffect } from 'react'
import { useMatch } from "react-router-dom";
import axios from 'axios'
import moment from 'moment'
import { Descriptions, PageHeader } from 'antd';

export default function NewsPreview() {
    const [newsInfo, setNewsInfo] = useState(null)
    const { params: { id } } = useMatch('/news-manage/preview/:id')

    const auditList = ["未審核", "審核中", "已通過", "未通過"]
    const publishList = ["未發布", "待發布", "已上線", "已下線"]
    const colorList = ["black", "orange", "green", "red"]

    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo(res.data)
        })
    }, [id])

    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="作者">
                                {newsInfo.author}
                            </Descriptions.Item>
                            <Descriptions.Item label="創建時間">
                                {moment(newsInfo.createTime)
                                    .format("YYYY/MM/DD HH:mm:ss")}
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
                            <Descriptions.Item
                                contentStyle={{
                                    color: colorList[newsInfo.auditState]
                                }}
                                label="審核狀態"
                            >
                                {auditList[newsInfo.auditState]}
                            </Descriptions.Item>
                            <Descriptions.Item
                                contentStyle={{
                                    color: colorList[newsInfo.publishState]
                                }}
                                label="發布狀態"
                            >
                                {publishList[newsInfo.publishState]}
                            </Descriptions.Item>
                            <Descriptions.Item label="瀏覽數">
                                {newsInfo.view}
                            </Descriptions.Item>
                            <Descriptions.Item label="讚">
                                {newsInfo.star}
                            </Descriptions.Item>
                            <Descriptions.Item label="評論數">
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
