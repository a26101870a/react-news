import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from '../views/login/Login';
import NewsSendBox from '../views/sendbox/NewsSendBox';
import Home from '../views/sendbox/home/Home';
import UserList from '../views/sendbox/user-manager/UserList';
import RoleList from '../views/sendbox/right-manager/RoleList';
import RightList from '../views/sendbox/right-manager/RightList';
import NewsAdd from '../views/sendbox/news-manage/NewsAdd';
import NewsCategory from '../views/sendbox/news-manage/NewsCategory';
import NewsDraft from '../views/sendbox/news-manage/NewsDraft';
import Audit from '../views/sendbox/audit-manage/Audit';
import AuditList from '../views/sendbox/audit-manage/AuditList';
import Unpublished from '../views/sendbox/publish-manage/Unpublished';
import Published from '../views/sendbox/publish-manage/Published';
import Sunset from '../views/sendbox/publish-manage/Sunset';
import NoPermission from '../views/sendbox/nopermission/NoPermission';
import NewsPreview from '../views/sendbox/news-manage/NewsPreview';
import NewsUpdate from '../views/sendbox/news-manage/NewsUpdate';
import News from '../views/news/News';
import Detail from '../views/news/Detail';

const RouteList = [
    { path: '/home', element: <Home /> },
    { path: '/user-manage/list', element: <UserList /> },
    { path: '/right-manage/role/list', element: <RoleList /> },
    { path: '/right-manage/right/list', element: <RightList /> },
    { path: '/news-manage/add', element: < NewsAdd /> },
    { path: '/news-manage/draft', element: <NewsDraft /> },
    { path: '/news-manage/category', element: <NewsCategory /> },
    { path: '/news-manage/preview/:id', element: <NewsPreview /> },
    { path: '/news-manage/update/:id', element: <NewsUpdate /> },
    { path: '/audit-manage/audit', element: <Audit /> },
    { path: '/audit-manage/list', element: <AuditList /> },
    { path: '/publish-manage/unpublished', element: <Unpublished /> },
    { path: '/publish-manage/published', element: <Published /> },
    { path: '/publish-manage/sunset', element: <Sunset /> }
];

export default function indexRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/news' element={<News />} />
                <Route path='/detail/:id' element={<Detail />} />
                <Route path='/' element={
                    localStorage.getItem('token') ?
                        <NewsSendBox /> :
                        <Navigate to='/login' />
                }>
                    <Route index element={<Navigate to='home' />} />
                    {RouteList.map(item =>
                        <Route
                            key={item.path}
                            path={item.path}
                            element={item.element}
                        />
                    )}
                    <Route path='*' element={<NoPermission />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}
