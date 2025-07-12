// 应用配置接口
export interface AppConfig {
  id: string
  name: string
  title: string
  description: string
  version: string
  author: string
  tags: string[]
  category: string
  status: 'planned' | 'planning' | 'developing' | 'completed'
  subdomain?: string
  path: string
  icon?: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
  dependencies?: string[]
  features: string[]
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage?: string
  }
}

// 应用组件接口
export interface AppComponent {
  default: React.ComponentType
  config: AppConfig
}

// 应用注册表
export interface AppRegistry {
  [key: string]: () => Promise<AppComponent>
}