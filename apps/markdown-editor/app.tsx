'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { markdownEditorConfig } from './config';

// 动态导入防止SSR问题
const MarkdownEditor = dynamic(() => import('./components/MarkdownEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg">加载编辑器中...</div>
    </div>
  )
});

export default function MarkdownEditorApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标题栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Editor.md</h1>
              <span className="text-sm text-gray-500">开源在线Markdown编辑器</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/pandao/editor.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://pandao.github.io/editor.md/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                原版演示
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <MarkdownEditor />
        </div>
      </main>

      {/* 底部信息 */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            <p>基于 Editor.md 构建 • 支持实时预览、代码高亮、数学公式等功能</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { markdownEditorConfig as config };