import type { AppConfig } from '@/shared/types/app';

export const qrGeneratorConfig: AppConfig = {
  id: 'qr-generator',
  name: 'qr-generator',
  title: '二维码生成器',
  description: '功能完整的二维码生成器，支持URL、文本和联系人信息生成',
  version: '1.0.0',
  author: '100Apps Team',
  tags: ['二维码', 'QR码', '生成器', '工具'],
  category: '工具',
  status: 'completed',
  path: '/apps/qr-generator',
  icon: '📱',
  createdAt: '2025-07-13T00:00:00Z',
  updatedAt: '2025-07-13T00:00:00Z',
  features: [
    'URL 二维码生成',
    '文本二维码生成',
    '联系人 (vCard) 二维码生成',
    '实时预览',
    '二维码下载 (PNG)',
    '数据内容复制'
  ],
  seo: {
    title: '二维码生成器 - 免费在线QR码工具',
    description: '免费在线二维码(QR码)生成器，可以为网址、文本、联系人信息等快速生成二维码，支持下载和分享。',
    keywords: ['二维码生成器', 'QR码', 'vCard', '在线工具', '免费'],
  }
};