import React from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSendBox from '../views/sendbox/NewsSendBox'
import Home from '../views/sendbox/home/Home'
import RightList from '../views/sendbox/right-manager/RightList'
import RoleList from '../views/sendbox/right-manager/RoleList'
import UserList from '../views/sendbox/user-manager/UserList'
import NoPermission from '../views/sendbox/nopermission/NoPermission'

export default function indexRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path='/' element={
                    localStorage.getItem("token") === "true" ?
                        <NewsSendBox /> :
                        <Navigate to="/login" />
                }>
                    <Route index element={<Navigate to='home' />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/user-manage/list" element={<UserList />} />
                    <Route path="/right-manage/role/list" element={<RoleList />} />
                    <Route path="/right-manage/right/list" element={<RightList />} />
                    <Route path="*" element={<NoPermission />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}
