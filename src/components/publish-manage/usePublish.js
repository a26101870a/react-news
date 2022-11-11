import { useEffect, useState } from 'react'
import { Table, Tag, Button, notification } from 'antd'
import axios from 'axios'

function usePublish(type) {
    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        axios(`/news?author=${username}&publishState=${type}&_expand=category`)
            .then(res => {
                setDataSource(res.data)
            })
    }, [username, type])

    function handlePublish(id) {
        setDataSource(dataSource.filter(item => item.id !== id))

        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        })
            .then(() => {
                notification.info({
                    message: "通知",
                    description:
                        `您可以到 [發布管理/已發布] 中查看您的新聞。`,
                    placement: 'bottomRight',
                })
            })
    }

    function handleSunset(id) {
        setDataSource(dataSource.filter(item => item.id !== id))

        axios.patch(`/news/${id}`, {
            "publishState": 3,
        })
            .then(() => {
                notification.info({
                    message: "通知",
                    description:
                        `您可以到 [發布管理/已下線] 中查看您的新聞。`,
                    placement: 'bottomRight',
                })
            })
    }

    function handleDelete(id) {
        setDataSource(dataSource.filter(item => item.id !== id))

        axios.delete(`/news/${id}}`)
            .then(() => {
                notification.info({
                    message: "通知",
                    description:
                        `您已經刪除了已下線的新聞。`,
                    placement: 'bottomRight',
                })
            })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish