'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    editormd: any;
    jQuery: any;
    $: any;
  }
}

const MarkdownEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editor, setEditor] = useState<any>(null);

  const defaultMarkdown = `# Editor.md

![](https://pandao.github.io/editor.md/images/logos/editormd-logo-180x180.png)

![](https://img.shields.io/github/stars/pandao/editor.md.svg) ![](https://img.shields.io/github/forks/pandao/editor.md.svg) ![](https://img.shields.io/github/tag/pandao/editor.md.svg) ![](https://img.shields.io/github/release/pandao/editor.md.svg) ![](https://img.shields.io/github/issues/pandao/editor.md.svg) ![](https://img.shields.io/bower/v/editor.md.svg)

**Editor.md** : The open source embeddable online markdown editor (component).

### Features

- 支持标准的 Markdown / CommonMark 和 GFM (GitHub Flavored Markdown) 语法；
- 支持实时预览、图片（跨域）上传、预格式文本/代码/表格插入、代码折叠、跳转到行、搜索替换、只读模式、焦点写作模式等；
- 支持 ToC（Table of Contents）、Emoji表情、Task lists、@链接等 Markdown 扩展语法；
- 支持 TeX 科学公式（基于 KaTeX）、流程图 Flowchart 和 时序图 Sequence Diagram;
- 支持识别和解析 HTML 标签，并且支持自定义过滤标签及过滤器解析，具有可靠的安全性和几乎无限的扩展性；
- 支持 AMD / CMD 模块化加载（支持 Require.js & Sea.js），并且支持自定义扩展插件；
- 兼容主流的浏览器（IE8+）和 Zepto.js，且支持 iPad 等平板设备；

### Examples

#### Code

\`\`\`javascript
function test() {
    console.log("Hello world!");
}
\`\`\`

#### Tables

| Feature | Support |
| ------- | ------- |
| Tables | ✓ |
| Alignment | ✓ |
| Wraptext | ✓ |

#### Task List

- [x] 支持以 PDF 格式导出文稿
- [x] 改进 Lib 的 API 接口
- [ ] 新增Todo列表功能
- [ ] 改进LaTex功能
    - [x] 支持科学公式
    - [x] 支持延迟显示
    - [ ] 支持编辑公式

#### Emoji

:smile: :blush: :smiley: :stuck_out_tongue_winking_eye: :smirk: :grinning: :wink:

#### TeX(KaTeX)

$$E=mc^2$$

Inline $$E=mc^2$$ formula.

#### FlowChart

\`\`\`flow
st=>start: 用户登陆
op=>operation: 登陆操作
cond=>condition: 登陆成功 Yes or No?
e=>end: 进入后台

st->op->cond
cond(yes)->e
cond(no)->op
\`\`\`

> **提示：** 想了解更多，请查看 [原版演示页面](https://pandao.github.io/editor.md/) 。
`;

  useEffect(() => {
    const loadScripts = async () => {
      try {
        // 动态加载 jQuery
        if (!window.jQuery) {
          await loadScript('https://cdn.bootcdn.net/ajax/libs/jquery/1.11.3/jquery.min.js');
        }

        // 动态加载 Editor.md CSS
        await loadCSS('https://cdn.bootcdn.net/ajax/libs/editor-md/1.5.0/css/editormd.min.css');

        // 动态加载 Editor.md JS
        await loadScript('https://cdn.bootcdn.net/ajax/libs/editor-md/1.5.0/editormd.min.js');

        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Editor.md:', error);
        // 如果CDN加载失败，使用备用方案
        setIsLoaded(true);
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (isLoaded && editorRef.current && window.editormd && !editor) {
      try {
        const editorInstance = window.editormd('markdown-editor', {
          width: '100%',
          height: 640,
          syncScrolling: 'single',
          path: 'https://cdn.bootcdn.net/ajax/libs/editor-md/1.5.0/lib/',
          theme: 'default',
          previewTheme: 'default',
          editorTheme: 'default',
          markdown: defaultMarkdown,
          codeFold: true,
          saveHTMLToTextarea: true,
          searchReplace: true,
          htmlDecode: 'style,script,iframe|on*',
          emoji: true,
          taskList: true,
          tocm: true,
          tex: true,
          flowChart: true,
          sequenceDiagram: true,
          dialogLockScreen: false,
          dialogShowMask: false,
          dialogDraggable: false,
          placeholder: '请输入 Markdown 文档...',
          toolbarIcons: function() {
            return [
              'undo', 'redo', '|',
              'bold', 'del', 'italic', 'quote', 'ucwords', 'uppercase', 'lowercase', '|',
              'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '|',
              'list-ul', 'list-ol', 'hr', '|',
              'link', 'reference-link', 'image', 'code', 'preformatted-text', 'code-block', 'table', 'datetime', 'emoji', 'html-entities', 'pagebreak', '|',
              'goto-line', 'watch', 'preview', 'fullscreen', 'clear', 'search', '|',
              'help', 'info'
            ];
          },
          onload: function() {
            console.log('Editor.md loaded successfully!');
          }
        });

        setEditor(editorInstance);
      } catch (error) {
        console.error('Failed to initialize Editor.md:', error);
      }
    }
  }, [isLoaded, editor]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  const loadCSS = (href: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`link[href="${href}"]`)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
      document.head.appendChild(link);
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载 Editor.md...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="markdown-editor" ref={editorRef}>
        <textarea
          style={{ display: 'none' }}
          defaultValue={defaultMarkdown}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;