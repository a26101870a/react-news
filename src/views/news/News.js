import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'
import { PageHeader, Card, Col, Row, List } from 'antd';
import _ from 'lodash'
import './News.css'

export default function News() {
    const [list, setList] = useState([])

    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            setList(Object.entries(_.groupBy(res.data, item =>
                item.category.title)))
        })
    }, [])

    return (
        <div style={{
            width: '95%',
            margin: '0 auto'
        }}>
            <PageHeader
                className="site-page-header"
                title="全球大新聞"
                subTitle="查看新聞"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        list.map(item =>
                            <Col
                                span={8}
                                key={item[0]}
                            >
                                <Card
                                    title={item[0]}
                                    bordered={true}
                                    hoverable={true}
                                >
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={(data) =>
                                            <List.Item>
                                                <Link
                                                    className="ellipsis"
                                                    to={`/detail/${data.id}`}
                                                >
                                                    {data.title}
                                                </Link>
                                            </List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    )
}
