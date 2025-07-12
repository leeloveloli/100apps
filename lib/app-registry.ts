import type { AppConfig } from '@/shared/types/app'

// 应用组件接口
export interface AppModule {
  default: React.ComponentType
  config: AppConfig
}

// 应用注册表 - 延迟加载所有应用
const APP_REGISTRY = {
  calculator: () => import('@/apps/calculator/app'),
  // 更多应用将在这里注册...
} as const

export type AppId = keyof typeof APP_REGISTRY

// 获取所有注册的应用ID
export function getRegisteredApps(): AppId[] {
  return Object.keys(APP_REGISTRY) as AppId[]
}

// 动态加载应用
export async function loadApp(appId: AppId): Promise<AppModule | null> {
  try {
    const loader = APP_REGISTRY[appId]
    if (!loader) {
      console.error(`应用 "${appId}" 未注册`)
      return null
    }
    
    const module = await loader()
    return module
  } catch (error) {
    console.error(`加载应用 "${appId}" 失败:`, error)
    return null
  }
}

// 通过路径查找应用ID
export function findAppByPath(path: string): AppId | null {
  // 移除前导斜杠
  const cleanPath = path.replace(/^\/+/, '')
  
  // 匹配 /apps/[appId] 格式
  const appMatch = cleanPath.match(/^apps\/([^\/]+)/)
  if (appMatch) {
    const appId = appMatch[1] as AppId
    return APP_REGISTRY[appId] ? appId : null
  }
  
  return null
}

// 通过子域名查找应用ID
export function findAppBySubdomain(subdomain: string): AppId | null {
  // 这里可以实现子域名到应用ID的映射
  // 目前简单映射：calculator.domain.com -> calculator
  const mappings: Record<string, AppId> = {
    calc: 'calculator',
    calculator: 'calculator',
    todo: 'todo',
    weather: 'weather',
  }
  
  return mappings[subdomain] || null
}

// 获取应用配置（不加载组件）
export async function getAppConfig(appId: AppId): Promise<AppConfig | null> {
  try {
    const app = await loadApp(appId)
    return app?.config || null
  } catch (error) {
    console.error(`获取应用 "${appId}" 配置失败:`, error)
    return null
  }
}