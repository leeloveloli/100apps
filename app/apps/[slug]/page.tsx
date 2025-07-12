import { notFound } from 'next/navigation'
import { loadApp, getRegisteredApps } from '@/lib/app-registry'
import type { AppId } from '@/lib/app-registry'

interface AppPageProps {
  params: {
    slug: string
  }
}

export default async function AppPage({ params }: AppPageProps) {
  const { slug } = params
  
  // 检查应用是否存在
  const registeredApps = getRegisteredApps()
  if (!registeredApps.includes(slug as AppId)) {
    notFound()
  }
  
  // 加载应用
  const app = await loadApp(slug as AppId)
  if (!app) {
    notFound()
  }
  
  const AppComponent = app.default
  
  return <AppComponent />
}

// 生成静态路径
export async function generateStaticParams() {
  const apps = getRegisteredApps()
  
  return apps.map((app) => ({
    slug: app,
  }))
}

// 为每个应用生成元数据
export async function generateMetadata({ params }: AppPageProps) {
  const { slug } = params
  const app = await loadApp(slug as AppId)
  
  if (!app) {
    return {
      title: '应用未找到',
    }
  }
  
  const { config } = app
  
  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords.join(', '),
    openGraph: {
      title: config.seo.title,
      description: config.seo.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.seo.title,
      description: config.seo.description,
    },
  }
}