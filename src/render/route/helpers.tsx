import { createElement, lazy, Suspense } from 'react'
import { RouteMatch, RouteObject } from 'react-router'

export interface IRouteConfig extends Omit<RouteObject, 'children' | 'index'> {
  /** 路由名称 */
  name?: string
  index?: boolean
  children?: IRouteConfig[]
}

export interface IRouterMatch extends Omit<RouteMatch, 'route'> {
  route: IRouteConfig
}

export interface IRouterProvider {
  routes: IRouterMatch[]
  route: IRouteConfig
}

export function load<T extends {}>(factory: any, stateProps?: T) {
  return (
    <Suspense fallback={null}>
      {createElement<T>(lazy(factory), stateProps)}
    </Suspense>
  )
}
