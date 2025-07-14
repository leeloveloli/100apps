import { headers } from 'next/headers'
import { findAppBySubdomain, findAppByPath, type AppId } from './app-registry'

export interface RouteContext {
  appId: AppId | null
  routeType: 'subdomain' | 'path' | 'home'
  subdomain?: string
  path: string
  host: string
}

// 解析当前请求的路由上下文
export async function parseRouteContext(): Promise<RouteContext> {
  const headersList = headers()
  const host = headersList.get('host') || 'localhost'
  const pathname = headersList.get('x-pathname') || '/'
  
  // 解析子域名
  const hostParts = host.split('.')
  const subdomain = hostParts.length > 2 ? hostParts[0] : null
  
  // 首先尝试子域名路由
  if (subdomain && subdomain !== 'www') {
    const appId = findAppBySubdomain(subdomain)
    if (appId) {
      return {
        appId,
        routeType: 'subdomain',
        subdomain,
        path: pathname,
        host
      }
    }
  }
  
  // 尝试路径路由
  const pathAppId = findAppByPath(pathname)
  if (pathAppId) {
    return {
      appId: pathAppId,
      routeType: 'path',
      path: pathname,
      host
    }
  }
  
  // 默认返回主页
  return {
    appId: null,
    routeType: 'home',
    path: pathname,
    host
  }
}

// 生成应用URL
export function generateAppUrl(appId: AppId, baseHost: string, preferSubdomain = true): string {
  if (preferSubdomain) {
    // 子域名URL: calculator.domain.com
    const domain = baseHost.replace(/^[^.]+\./, '') // 移除现有子域名
    return `https://${appId}.${domain}`
  } else {
    // 路径URL: domain.com/apps/calculator
    return `https://${baseHost}/apps/${appId}`
  }
}

// 检查是否为应用路由
export function isAppRoute(pathname: string): boolean {
  return pathname.startsWith('/apps/') || findAppByPath(pathname) !== null
}