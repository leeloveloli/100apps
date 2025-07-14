import type { AppConfig } from '@/shared/types/app'

export const markdownEditorConfig: AppConfig = {
  id: 'markdown-editor',
  name: 'markdown-editor',
  title: 'Markdown 编辑器',
  description: '功能完整的在线Markdown编辑器，支持实时预览、代码高亮、数学公式等',
  version: '1.0.0',
  author: '100Apps Team',
  tags: ['工具', '编辑器', 'Markdown', '写作'],
  category: '工具',
  status: 'completed',
  path: '/apps/markdown-editor',
  icon: '📝',
  createdAt: '2025-07-13T00:00:00Z',
  updatedAt: '2025-07-13T00:00:00Z',
  features: [
    '实时预览',
    'GFM 语法支持',
    '代码高亮',
    '数学公式 (KaTeX)',
    '流程图和时序图',
    'Emoji 表情',
    '全屏和只读模式'
  ],
  seo: {
    title: '在线 Markdown 编辑器 - 实时预览、功能强大',
    description: '免费好用的在线Markdown编辑器，支持实时预览、代码高亮、数学公式、流程图等，是您写作和记录的得力工具。',
    keywords: ['Markdown编辑器', '在线Markdown', '实时预览', 'GFM', 'KaTeX', '写作工具'],
  }
};