import React from 'react'
import { Link } from "react-router-dom";
import { Table } from 'antd'

export default function NewsPublish({ dataSource, button }) {
    const columns = [
        {
            title: '新聞標題',
            dataIndex: 'title',
            render: (title, item) => {
                return <Link to={`/news-manage/preview/${item.id}`}>
                    {title}
                </Link>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新聞分類',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {button(item.id)}
                </div>
            }
        },
    ];


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
