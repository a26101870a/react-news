import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Outlet, useLocation } from 'react-router-dom'
import NoPermission from '../../views/sendbox/nopermission/NoPermission'

export default function NewsRouter() {
    const [BackRouteList, setBackRouteList] = useState([])
    const [showRouteFlag, setShowRouteFlag] = useState(false)
    const location = useLocation()

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    const LocalRouterMap = [
        "/home",
        "/user-manage/list",
        "/right-manage/role/list",
        "/right-manage/right/list",
        "/news-manage/add",
        "/news-manage/draft",
        "/news-manage/category",
        "/news-manage/preview/",
        "/news-manage/update/",
        "/audit-manage/audit",
        "/audit-manage/list",
        "/publish-manage/unpublished",
        "/publish-manage/published",
        "/publish-manage/sunset"
    ]

    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])

    useEffect(() => {
        if (checkRouter() && checkUserPermission()) {
            setShowRouteFlag(true)
        } else {
            setShowRouteFlag(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])


    function checkRouter() {
        if (BackRouteList.length === 0) {
            return true
        } else {
            let isRouterExisting = LocalRouterMap.includes(location.pathname)
            let item = BackRouteList.filter(item =>
                item.key === location.pathname)[0]

            if (location.pathname.includes('/news-manage/preview')) {
                item = BackRouteList.filter(item =>
                    item.key === '/news-manage/preview/:id')[0]

                isRouterExisting = true
            }

            if (location.pathname.includes('/news-manage/update')) {
                item = BackRouteList.filter(item =>
                    item.key === '/news-manage/update/:id')[0]

                isRouterExisting = true
            }

            return isRouterExisting && (item.pagepermission || item.routepermission)
        }
    }

    function checkUserPermission() {
        if (BackRouteList.length === 0) {
            return true
        } else {
            let item = BackRouteList.filter(item =>
                item.key === location.pathname)[0]

            if (location.pathname.includes('/news-manage/preview')) {
                item = BackRouteList.filter(item =>
                    item.key === '/news-manage/preview/:id')[0]
            }

            if (location.pathname.includes('/news-manage/update')) {
                item = BackRouteList.filter(item =>
                    item.key === '/news-manage/update/:id')[0]
            }

            return rights.includes(item.key)
        }
    }

    return (
        <>
            {showRouteFlag && <Outlet />}
            {!showRouteFlag && <NoPermission />}
        </>
    )
}
