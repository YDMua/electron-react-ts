export * from './helpers'
import { Suspense } from 'react'
import { matchRoutes, useRoutes } from 'react-router'
import { config } from './config'
import { IRouteConfig } from './helpers'

export default function Router() {
  const element = useRoutes(config as any)
  const routes = matchRoutes(config as any, location.pathname) || []
  const route = routes.length ? routes[routes.length - 1].route : {}
  document.title = (route as IRouteConfig)?.['name'] || '蚂蚁社区'
  return <Suspense fallback={<div />}>{element}</Suspense>
}
