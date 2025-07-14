import type { AppConfig } from '@/shared/types/app'

export const codeConverterConfig: AppConfig = {
  id: 'code-converter',
  name: 'code-converter',
  title: '代码转换器',
  description: '在线数据格式转换工具，支持JSON、YAML、XML、CSV、Base64等格式互转',
  version: '1.0.0',
  author: '100Apps Team',
  tags: ['工具', '转换器', '数据格式', '开发'],
  category: '开发工具',
  status: 'completed',
  subdomain: 'converter',
  path: '/apps/code-converter',
  icon: '🔄',
  createdAt: '2025-07-12T00:00:00Z',
  updatedAt: '2025-07-12T00:00:00Z',
  features: [
    'JSON ↔ YAML ↔ XML ↔ CSV 互转',
    'Base64 编码解码',
    '实时转换预览',
    '语法高亮显示',
    '错误提示和修正建议',
    '示例数据一键导入',
    '转换结果一键复制'
  ],
  seo: {
    title: '代码转换器 - 在线数据格式转换工具',
    description: '免费在线代码转换器，支持JSON、YAML、XML、CSV、Base64等数据格式互转，开发者必备工具',
    keywords: ['代码转换器', 'JSON转换', 'YAML转换', 'XML转换', 'CSV转换', 'Base64编码', '数据格式转换'],
  }
}