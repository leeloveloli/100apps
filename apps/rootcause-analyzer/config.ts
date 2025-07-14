import type { AppConfig } from '@/shared/types/app';

export const rootcauseAnalyzerConfig: AppConfig = {
  id: 'rootcause-analyzer',
  name: 'rootcause-analyzer',
  title: '5Why根因分析',
  description: 'AI驱动的智能根因分析工具，帮助你系统性发现问题的根本原因',
  version: '1.0.0',
  author: '100Apps Team',
  tags: ['5why', '根因分析', 'AI引导', '问题解决'],
  category: '分析工具',
  status: 'completed',
  path: '/apps/rootcause-analyzer',
  icon: '🔍',
  createdAt: '2025-07-13T00:00:00Z',
  updatedAt: '2025-07-13T00:00:00Z',
  features: [
    'AI 引导的 5Why 分析流程',
    '智能问题生成',
    '分析树可视化',
    '自动生成关键洞察',
    '根本原因识别',
    '解决方案建议',
    '可导出分析报告'
  ],
  seo: {
    title: 'AI根因分析 (5Why) - 智能问题解决工具',
    description: '使用AI驱动的5Why方法，深入挖掘问题的根本原因。智能引导、可视化分析树、自动生成洞察和解决方案，助您高效解决复杂问题。',
    keywords: ['根因分析', '5Why', 'RCA', 'AI', '问题解决', '决策工具'],
  }
};