import { Navigate } from 'react-router-dom'
import { IRouteConfig, load } from './helpers'

export const config: IRouteConfig[] = [
  {
    path: '/',
    index: true,
    element: <Navigate to="/home" replace />,
  },
  {
    name: '首页',
    path: '/home',
    index: true,
    element: load(() => import('src/render/pages/Home')),
  },
  {
    name: '蚂蚁社区',
    path: '/main',
    index: true,
    element: load(() => import('src/render/pages/Main')),
  },
  {
    path: '*',
    element: load(() => import('src/render/pages/404')),
  },
]
