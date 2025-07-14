import { notFound } from 'next/navigation'
import { loadApp, getRegisteredApps } from '@/lib/app-registry'
import type { AppId } from '@/lib/app-registry'
import type { Metadata } from 'next'

// 直接导入所有配置
import { calculatorConfig } from '@/apps/calculator/config'
import { codeConverterConfig } from '@/apps/code-converter/config'
import { markdownEditorConfig } from '@/apps/markdown-editor/config'
import { qrGeneratorConfig } from '@/apps/qr-generator/config'
import { rootcauseAnalyzerConfig } from '@/apps/rootcause-analyzer/config'

// 配置映射
const CONFIG_MAP = {
  calculator: calculatorConfig,
  'code-converter': codeConverterConfig,
  'markdown-editor': markdownEditorConfig,
  'qr-generator': qrGeneratorConfig,
  'rootcause-analyzer': rootcauseAnalyzerConfig,
} as const

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AppPage({ params }: Props) {
  const { slug } = params
  
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
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params

  try {
    // 使用静态配置映射而不是动态加载
    const config = CONFIG_MAP[slug as keyof typeof CONFIG_MAP]

    if (!config) {
      console.error(`Config not found for app: ${slug}`)
      return {
        title: '应用未找到',
      }
    }

    if (!config.seo) {
      console.error(`SEO config not found for app: ${slug}`)
      return {
        title: config.title || '应用',
        description: config.description || '',
      }
    }

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
  } catch (error) {
    console.error(`Error generating metadata for ${slug}:`, error)
    return {
      title: '应用',
      description: '',
    }
  }
}