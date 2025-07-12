import type { AppConfig } from '@/shared/types/app'

export const calculatorConfig: AppConfig = {
  id: 'calculator',
  name: 'calculator',
  title: '在线计算器',
  description: '功能齐全的在线计算器，支持基础运算、科学计算等功能',
  version: '1.0.0',
  author: '100Apps Team',
  tags: ['工具', '计算器', '数学'],
  category: '工具',
  status: 'completed',
  subdomain: 'calc',
  path: '/apps/calculator',
  icon: '🧮',
  createdAt: '2025-07-12T00:00:00Z',
  updatedAt: '2025-07-12T00:00:00Z',
  features: [
    '基础四则运算',
    '科学计算函数',
    '历史记录',
    '键盘支持',
    '响应式设计'
  ],
  seo: {
    title: '在线计算器 - 免费科学计算器工具',
    description: '免费在线计算器，支持基础运算和科学计算，界面简洁，功能强大',
    keywords: ['计算器', '在线计算器', '科学计算器', '数学工具'],
  }
}