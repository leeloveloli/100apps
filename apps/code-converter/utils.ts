// 数据格式类型定义
export type DataFormat = 'json' | 'yaml' | 'xml' | 'csv' | 'base64' | 'markdown' | 'html' | 'latex' | 'rst'

export interface ConversionResult {
  success: boolean
  data?: string
  error?: string
}

export interface FormatInfo {
  id: DataFormat
  name: string
  description: string
  example: string
}

// 格式信息配置
export const formatInfo: Record<DataFormat, FormatInfo> = {
  json: {
    id: 'json',
    name: 'JSON',
    description: 'JavaScript Object Notation',
    example: `{
  "name": "张三",
  "age": 30,
  "city": "北京",
  "hobbies": ["读书", "旅行"]
}`
  },
  yaml: {
    id: 'yaml',
    name: 'YAML',
    description: 'YAML Ain\'t Markup Language',
    example: `name: 张三
age: 30
city: 北京
hobbies:
  - 读书
  - 旅行`
  },
  xml: {
    id: 'xml',
    name: 'XML',
    description: 'eXtensible Markup Language',
    example: `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>张三</name>
  <age>30</age>
  <city>北京</city>
  <hobbies>
    <hobby>读书</hobby>
    <hobby>旅行</hobby>
  </hobbies>
</person>`
  },
  csv: {
    id: 'csv',
    name: 'CSV',
    description: 'Comma-Separated Values',
    example: `name,age,city,hobbies
张三,30,北京,"读书,旅行"
李四,25,上海,"游戏,电影"
王五,35,深圳,"运动,音乐"`
  },
  base64: {
    id: 'base64',
    name: 'Base64',
    description: 'Base64 编码',
    example: `SGVsbG8gV29ybGQhIOWTiCDkuJbnlYw=`
  },
  markdown: {
    id: 'markdown',
    name: 'Markdown',
    description: '轻量级标记语言',
    example: `# 标题
## 二级标题

这是一段**粗体**文本和*斜体*文本。

- 列表项 1
- 列表项 2
- 列表项 3

[链接](https://example.com)

\`\`\`javascript
console.log('Hello World!');
\`\`\``
  },
  html: {
    id: 'html',
    name: 'HTML',
    description: '超文本标记语言',
    example: `<!DOCTYPE html>
<html>
<head>
    <title>示例页面</title>
</head>
<body>
    <h1>标题</h1>
    <p>这是一个<strong>HTML</strong>示例。</p>
    <ul>
        <li>列表项 1</li>
        <li>列表项 2</li>
    </ul>
</body>
</html>`
  },
  latex: {
    id: 'latex',
    name: 'LaTeX',
    description: '学术文档排版系统',
    example: `\\documentclass{article}
\\begin{document}

\\title{示例文档}
\\author{作者}
\\maketitle

\\section{介绍}
这是一个 \\textbf{LaTeX} 文档示例。

\\begin{itemize}
    \\item 列表项 1
    \\item 列表项 2
\\end{itemize}

\\end{document}`
  },
  rst: {
    id: 'rst',
    name: 'reStructuredText',
    description: '结构化文本标记语言',
    example: `标题
====

这是 **reStructuredText** 格式的示例。

- 列表项 1
- 列表项 2

代码块::

    print("Hello World!")

`链接 <https://example.com>`_`
  }
}

// JSON 到其他格式的转换
export function convertFromJSON(jsonStr: string, targetFormat: DataFormat): ConversionResult {
  try {
    const data = JSON.parse(jsonStr)
    
    switch (targetFormat) {
      case 'yaml':
        return { success: true, data: jsonToYaml(data) }
      case 'xml':
        return { success: true, data: jsonToXml(data) }
      case 'csv':
        return { success: true, data: jsonToCsv(data) }
      case 'base64':
        return { success: true, data: btoa(unescape(encodeURIComponent(jsonStr))) }
      case 'markdown':
        return { success: true, data: jsonToMarkdown(data) }
      case 'html':
        return { success: true, data: jsonToHtml(data) }
      case 'latex':
        return { success: true, data: jsonToLatex(data) }
      case 'rst':
        return { success: true, data: jsonToRst(data) }
      case 'json':
        return { success: true, data: JSON.stringify(data, null, 2) }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `JSON解析错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

// YAML 转换
export function convertFromYAML(yamlStr: string, targetFormat: DataFormat): ConversionResult {
  try {
    const data = parseYaml(yamlStr)
    
    switch (targetFormat) {
      case 'json':
        return { success: true, data: JSON.stringify(data, null, 2) }
      case 'xml':
        return { success: true, data: jsonToXml(data) }
      case 'csv':
        return { success: true, data: jsonToCsv(data) }
      case 'base64':
        return { success: true, data: btoa(unescape(encodeURIComponent(yamlStr))) }
      case 'markdown':
        return { success: true, data: jsonToMarkdown(data) }
      case 'html':
        return { success: true, data: jsonToHtml(data) }
      case 'latex':
        return { success: true, data: jsonToLatex(data) }
      case 'rst':
        return { success: true, data: jsonToRst(data) }
      case 'yaml':
        return { success: true, data: yamlStr }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `YAML解析错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

// XML 转换
export function convertFromXML(xmlStr: string, targetFormat: DataFormat): ConversionResult {
  try {
    const data = parseXml(xmlStr)
    
    switch (targetFormat) {
      case 'json':
        return { success: true, data: JSON.stringify(data, null, 2) }
      case 'yaml':
        return { success: true, data: jsonToYaml(data) }
      case 'csv':
        return { success: true, data: jsonToCsv(data) }
      case 'base64':
        return { success: true, data: btoa(unescape(encodeURIComponent(xmlStr))) }
      case 'markdown':
        return { success: true, data: jsonToMarkdown(data) }
      case 'html':
        return { success: true, data: jsonToHtml(data) }
      case 'latex':
        return { success: true, data: jsonToLatex(data) }
      case 'rst':
        return { success: true, data: jsonToRst(data) }
      case 'xml':
        return { success: true, data: xmlStr }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `XML解析错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

// CSV 转换
export function convertFromCSV(csvStr: string, targetFormat: DataFormat): ConversionResult {
  try {
    const data = parseCsv(csvStr)
    
    switch (targetFormat) {
      case 'json':
        return { success: true, data: JSON.stringify(data, null, 2) }
      case 'yaml':
        return { success: true, data: jsonToYaml(data) }
      case 'xml':
        return { success: true, data: jsonToXml(data) }
      case 'base64':
        return { success: true, data: btoa(unescape(encodeURIComponent(csvStr))) }
      case 'markdown':
        return { success: true, data: jsonToMarkdown(data) }
      case 'html':
        return { success: true, data: jsonToHtml(data) }
      case 'latex':
        return { success: true, data: jsonToLatex(data) }
      case 'rst':
        return { success: true, data: jsonToRst(data) }
      case 'csv':
        return { success: true, data: csvStr }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `CSV解析错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

// Base64 转换
export function convertFromBase64(base64Str: string, targetFormat: DataFormat): ConversionResult {
  try {
    const decoded = decodeURIComponent(escape(atob(base64Str)))
    
    switch (targetFormat) {
      case 'json':
        const jsonData = JSON.parse(decoded)
        return { success: true, data: JSON.stringify(jsonData, null, 2) }
      case 'yaml':
        return convertFromJSON(decoded, 'yaml')
      case 'xml':
        return convertFromJSON(decoded, 'xml')
      case 'csv':
        return convertFromJSON(decoded, 'csv')
      case 'markdown':
        return { success: true, data: decoded }
      case 'html':
        return { success: true, data: decoded }
      case 'latex':
        return { success: true, data: decoded }
      case 'rst':
        return { success: true, data: decoded }
      case 'base64':
        return { success: true, data: base64Str }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `Base64解码错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

// Markdown 转换
export function convertFromMarkdown(markdownStr: string, targetFormat: DataFormat): ConversionResult {
  try {
    switch (targetFormat) {
      case 'html':
        return { success: true, data: markdownToHtml(markdownStr) }
      case 'latex':
        return { success: true, data: markdownToLatex(markdownStr) }
      case 'rst':
        return { success: true, data: markdownToRst(markdownStr) }
      case 'base64':
        return { success: true, data: btoa(unescape(encodeURIComponent(markdownStr))) }
      case 'markdown':
        return { success: true, data: markdownStr }
      case 'json':
      case 'yaml':
      case 'xml':
      case 'csv':
        return { success: false, error: `Markdown无法直接转换为${formatInfo[targetFormat].name}格式` }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `Markdown解析错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

// HTML 转换
export function convertFromHTML(htmlStr: string, targetFormat: DataFormat): ConversionResult {
  try {
    switch (targetFormat) {
      case 'markdown':
        return { success: true, data: htmlToMarkdown(htmlStr) }
      case 'latex':
        return { success: true, data: htmlToLatex(htmlStr) }
      case 'rst':
        return { success: true, data: htmlToRst(htmlStr) }
      case 'base64':
        return { success: true, data: btoa(unescape(encodeURIComponent(htmlStr))) }
      case 'html':
        return { success: true, data: htmlStr }
      case 'json':
      case 'yaml':
      case 'xml':
      case 'csv':
        return { success: false, error: `HTML无法直接转换为${formatInfo[targetFormat].name}格式` }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `HTML解析错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

// LaTeX 转换
export function convertFromLatex(latexStr: string, targetFormat: DataFormat): ConversionResult {
  try {
    switch (targetFormat) {
      case 'markdown':
        return { success: true, data: latexToMarkdown(latexStr) }
      case 'html':
        return { success: true, data: latexToHtml(latexStr) }
      case 'rst':
        return { success: true, data: latexToRst(latexStr) }
      case 'base64':
        return { success: true, data: btoa(unescape(encodeURIComponent(latexStr))) }
      case 'latex':
        return { success: true, data: latexStr }
      case 'json':
      case 'yaml':
      case 'xml':
      case 'csv':
        return { success: false, error: `LaTeX无法直接转换为${formatInfo[targetFormat].name}格式` }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `LaTeX解析错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

// reStructuredText 转换
export function convertFromRst(rstStr: string, targetFormat: DataFormat): ConversionResult {
  try {
    switch (targetFormat) {
      case 'markdown':
        return { success: true, data: rstToMarkdown(rstStr) }
      case 'html':
        return { success: true, data: rstToHtml(rstStr) }
      case 'latex':
        return { success: true, data: rstToLatex(rstStr) }
      case 'base64':
        return { success: true, data: btoa(unescape(encodeURIComponent(rstStr))) }
      case 'rst':
        return { success: true, data: rstStr }
      case 'json':
      case 'yaml':
      case 'xml':
      case 'csv':
        return { success: false, error: `reStructuredText无法直接转换为${formatInfo[targetFormat].name}格式` }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `reStructuredText解析错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

export function convertData(input: string, sourceFormat: DataFormat, targetFormat: DataFormat): ConversionResult {
  if (!input.trim()) {
    return { success: false, error: '输入内容不能为空' }
  }
  
  if (sourceFormat === targetFormat) {
    return { success: true, data: input }
  }
  
  switch (sourceFormat) {
    case 'json':
      return convertFromJSON(input, targetFormat)
    case 'yaml':
      return convertFromYAML(input, targetFormat)
    case 'xml':
      return convertFromXML(input, targetFormat)
    case 'csv':
      return convertFromCSV(input, targetFormat)
    case 'base64':
      return convertFromBase64(input, targetFormat)
    case 'markdown':
      return convertFromMarkdown(input, targetFormat)
    case 'html':
      return convertFromHTML(input, targetFormat)
    case 'latex':
      return convertFromLatex(input, targetFormat)
    case 'rst':
      return convertFromRst(input, targetFormat)
    default:
      return { success: false, error: '不支持的源格式' }
  }
}

// 工具函数实现
function jsonToYaml(obj: any): string {
  return stringify(obj)
}

function jsonToXml(obj: any, rootName = 'root'): string {
  function toXml(obj: any, name: string): string {
    if (Array.isArray(obj)) {
      return obj.map(item => toXml(item, name.slice(0, -1))).join('\n')
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const content = Object.entries(obj)
        .map(([key, value]) => toXml(value, key))
        .join('\n')
      return `<${name}>\n${content}\n</${name}>`
    }
    
    return `<${name}>${escapeXml(String(obj))}</${name}>`
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj, rootName)}`
}

function jsonToCsv(data: any): string {
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0])
    const csvData = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ]
    return csvData.join('\n')
  }
  return '数据格式不适合转换为CSV'
}

function parseYaml(yamlStr: string): any {
  // 简单的YAML解析实现（生产环境建议使用js-yaml库）
  const lines = yamlStr.split('\n').filter(line => line.trim())
  const result: any = {}
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':')
      const value = valueParts.join(':').trim()
      const cleanKey = key.trim()
      
      if (value.startsWith('[') && value.endsWith(']')) {
        result[cleanKey] = value.slice(1, -1).split(',').map(v => v.trim())
      } else if (value.startsWith('-')) {
        if (!result[cleanKey]) result[cleanKey] = []
        result[cleanKey].push(value.slice(1).trim())
      } else if (!isNaN(Number(value))) {
        result[cleanKey] = Number(value)
      } else {
        result[cleanKey] = value
      }
    }
  }
  
  return result
}

function parseXml(xmlStr: string): any {
  // 简化的XML解析（生产环境建议使用DOMParser）
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlStr, 'text/xml')
  
  function xmlToJson(node: any): any {
    const result: any = {}
    
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent
    }
    
    if (node.childNodes && node.childNodes.length > 0) {
      for (const child of node.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const nodeName = child.nodeName
          const nodeValue = xmlToJson(child)
          
          if (result[nodeName]) {
            if (!Array.isArray(result[nodeName])) {
              result[nodeName] = [result[nodeName]]
            }
            result[nodeName].push(nodeValue)
          } else {
            result[nodeName] = nodeValue
          }
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          return child.textContent.trim()
        }
      }
    }
    
    return result
  }
  
  return xmlToJson(doc.documentElement)
}

function parseCsv(csvStr: string): any[] {
  const lines = csvStr.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const rows = lines.slice(1)
  
  return rows.map(row => {
    const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const obj: any = {}
    headers.forEach((header, index) => {
      obj[header] = values[index] || ''
    })
    return obj
  })
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// 简化的YAML stringify函数
function stringify(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent)
  
  if (Array.isArray(obj)) {
    return obj.map(item => `${spaces}- ${stringify(item, indent + 1).trim()}`).join('\n')
  }
  
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${spaces}${key}:\n${stringify(value, indent + 1)}`
        } else if (typeof value === 'object' && value !== null) {
          return `${spaces}${key}:\n${stringify(value, indent + 1)}`
        } else {
          return `${spaces}${key}: ${value}`
        }
      })
      .join('\n')
  }
  
  return String(obj)
}

// JSON 到标记语言的转换函数
function jsonToMarkdown(obj: any): string {
  function toMarkdown(obj: any, level = 1): string {
    if (Array.isArray(obj)) {
      return obj.map(item => `- ${typeof item === 'object' ? JSON.stringify(item) : item}`).join('\n')
    }
    
    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj)
        .map(([key, value]) => {
          const prefix = '#'.repeat(level)
          if (Array.isArray(value)) {
            return `${prefix} ${key}\n\n${toMarkdown(value, level + 1)}`
          } else if (typeof value === 'object' && value !== null) {
            return `${prefix} ${key}\n\n${toMarkdown(value, level + 1)}`
          } else {
            return `${prefix} ${key}\n\n${value}`
          }
        })
        .join('\n\n')
    }
    
    return String(obj)
  }
  
  return toMarkdown(obj)
}

function jsonToHtml(obj: any): string {
  function toHtml(obj: any): string {
    if (Array.isArray(obj)) {
      const items = obj.map(item => `<li>${typeof item === 'object' ? toHtml(item) : escapeHtml(String(item))}</li>`).join('')
      return `<ul>${items}</ul>`
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const content = Object.entries(obj)
        .map(([key, value]) => `<div><strong>${escapeHtml(key)}:</strong> ${toHtml(value)}</div>`)
        .join('')
      return content
    }
    
    return escapeHtml(String(obj))
  }
  
  return `<!DOCTYPE html>
<html>
<head>
    <title>转换结果</title>
    <meta charset="UTF-8">
</head>
<body>
    ${toHtml(obj)}
</body>
</html>`
}

function jsonToLatex(obj: any): string {
  function toLatex(obj: any, level = 1): string {
    if (Array.isArray(obj)) {
      const items = obj.map(item => `    \\item ${typeof item === 'object' ? JSON.stringify(item) : escapeLatex(String(item))}`).join('\n')
      return `\\begin{itemize}\n${items}\n\\end{itemize}`
    }
    
    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj)
        .map(([key, value]) => {
          const section = level === 1 ? 'section' : level === 2 ? 'subsection' : 'subsubsection'
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            return `\\${section}{${escapeLatex(key)}}\n\n${toLatex(value, level + 1)}`
          } else {
            return `\\${section}{${escapeLatex(key)}}\n\n${escapeLatex(String(value))}`
          }
        })
        .join('\n\n')
    }
    
    return escapeLatex(String(obj))
  }
  
  return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\begin{document}

\\title{数据转换结果}
\\maketitle

${toLatex(obj)}

\\end{document}`
}

function jsonToRst(obj: any): string {
  function toRst(obj: any, level = 1): string {
    const underlines = ['=', '-', '~', '^']
    
    if (Array.isArray(obj)) {
      return obj.map(item => `- ${typeof item === 'object' ? JSON.stringify(item) : item}`).join('\n')
    }
    
    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj)
        .map(([key, value]) => {
          const underline = underlines[Math.min(level - 1, underlines.length - 1)]
          const title = `${key}\n${underline.repeat(key.length)}`
          
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            return `${title}\n\n${toRst(value, level + 1)}`
          } else {
            return `${title}\n\n${value}`
          }
        })
        .join('\n\n')
    }
    
    return String(obj)
  }
  
  return toRst(obj)
}

// 标记语言互转函数
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n/g, '<br>')
}

function markdownToLatex(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, '\\subsubsection{$1}')
    .replace(/^## (.*$)/gim, '\\subsection{$1}')
    .replace(/^# (.*$)/gim, '\\section{$1}')
    .replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}')
    .replace(/\*(.*?)\*/g, '\\textit{$1}')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '\\href{$2}{$1}')
    .replace(/^- (.*$)/gim, '\\item $1')
    .replace(/(\\item .*\n?)+/g, '\\begin{itemize}\n$&\\end{itemize}\n')
}

function markdownToRst(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, (match, title) => `${title}\n${'~'.repeat(title.length)}`)
    .replace(/^## (.*$)/gim, (match, title) => `${title}\n${'-'.repeat(title.length)}`)
    .replace(/^# (.*$)/gim, (match, title) => `${title}\n${'='.repeat(title.length)}`)
    .replace(/\*\*(.*?)\*\*/g, '**$1**')
    .replace(/\*(.*?)\*/g, '*$1*')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '`$1 <$2>`_')
    .replace(/^- (.*$)/gim, '- $1')
}

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h1>(.*?)<\/h1>/g, '# $1')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<a href="([^"]*)">(.*?)<\/a>/g, '[$2]($1)')
    .replace(/<li>(.*?)<\/li>/g, '- $1')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]*>/g, '')
}

function htmlToLatex(html: string): string {
  return html
    .replace(/<h1>(.*?)<\/h1>/g, '\\section{$1}')
    .replace(/<h2>(.*?)<\/h2>/g, '\\subsection{$1}')
    .replace(/<h3>(.*?)<\/h3>/g, '\\subsubsection{$1}')
    .replace(/<strong>(.*?)<\/strong>/g, '\\textbf{$1}')
    .replace(/<em>(.*?)<\/em>/g, '\\textit{$1}')
    .replace(/<a href="([^"]*)">(.*?)<\/a>/g, '\\href{$1}{$2}')
    .replace(/<li>(.*?)<\/li>/g, '\\item $1')
    .replace(/<[^>]*>/g, '')
}

function htmlToRst(html: string): string {
  return html
    .replace(/<h1>(.*?)<\/h1>/g, (match, title) => `${title}\n${'='.repeat(title.length)}`)
    .replace(/<h2>(.*?)<\/h2>/g, (match, title) => `${title}\n${'-'.repeat(title.length)}`)
    .replace(/<h3>(.*?)<\/h3>/g, (match, title) => `${title}\n${'~'.repeat(title.length)}`)
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<a href="([^"]*)">(.*?)<\/a>/g, '`$2 <$1>`_')
    .replace(/<li>(.*?)<\/li>/g, '- $1')
    .replace(/<[^>]*>/g, '')
}

function latexToMarkdown(latex: string): string {
  return latex
    .replace(/\\section\{([^}]+)\}/g, '# $1')
    .replace(/\\subsection\{([^}]+)\}/g, '## $1')
    .replace(/\\subsubsection\{([^}]+)\}/g, '### $1')
    .replace(/\\textbf\{([^}]+)\}/g, '**$1**')
    .replace(/\\textit\{([^}]+)\}/g, '*$1*')
    .replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '[$2]($1)')
    .replace(/\\item\s+/g, '- ')
    .replace(/\\begin\{[^}]+\}|\\end\{[^}]+\}/g, '')
    .replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, '')
}

function latexToHtml(latex: string): string {
  return latex
    .replace(/\\section\{([^}]+)\}/g, '<h1>$1</h1>')
    .replace(/\\subsection\{([^}]+)\}/g, '<h2>$1</h2>')
    .replace(/\\subsubsection\{([^}]+)\}/g, '<h3>$1</h3>')
    .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
    .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
    .replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1">$2</a>')
    .replace(/\\item\s+/g, '<li>')
    .replace(/\\begin\{[^}]+\}|\\end\{[^}]+\}/g, '')
    .replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, '')
}

function latexToRst(latex: string): string {
  return latex
    .replace(/\\section\{([^}]+)\}/g, (match, title) => `${title}\n${'='.repeat(title.length)}`)
    .replace(/\\subsection\{([^}]+)\}/g, (match, title) => `${title}\n${'-'.repeat(title.length)}`)
    .replace(/\\subsubsection\{([^}]+)\}/g, (match, title) => `${title}\n${'~'.repeat(title.length)}`)
    .replace(/\\textbf\{([^}]+)\}/g, '**$1**')
    .replace(/\\textit\{([^}]+)\}/g, '*$1*')
    .replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '`$2 <$1>`_')
    .replace(/\\item\s+/g, '- ')
    .replace(/\\begin\{[^}]+\}|\\end\{[^}]+\}/g, '')
    .replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, '')
}

function rstToMarkdown(rst: string): string {
  return rst
    .replace(/^(.+)\n=+$/gm, '# $1')
    .replace(/^(.+)\n-+$/gm, '## $1')
    .replace(/^(.+)\n~+$/gm, '### $1')
    .replace(/\*\*([^*]+)\*\*/g, '**$1**')
    .replace(/\*([^*]+)\*/g, '*$1*')
    .replace(/`([^<]+) <([^>]+)>`_/g, '[$1]($2)')
    .replace(/^- /gm, '- ')
}

function rstToHtml(rst: string): string {
  return rst
    .replace(/^(.+)\n=+$/gm, '<h1>$1</h1>')
    .replace(/^(.+)\n-+$/gm, '<h2>$1</h2>')
    .replace(/^(.+)\n~+$/gm, '<h3>$1</h3>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^<]+) <([^>]+)>`_/g, '<a href="$2">$1</a>')
    .replace(/^- /gm, '<li>')
}

function rstToLatex(rst: string): string {
  return rst
    .replace(/^(.+)\n=+$/gm, '\\section{$1}')
    .replace(/^(.+)\n-+$/gm, '\\subsection{$1}')
    .replace(/^(.+)\n~+$/gm, '\\subsubsection{$1}')
    .replace(/\*\*([^*]+)\*\*/g, '\\textbf{$1}')
    .replace(/\*([^*]+)\*/g, '\\textit{$1}')
    .replace(/`([^<]+) <([^>]+)>`_/g, '\\href{$2}{$1}')
    .replace(/^- /gm, '\\item ')
}

// 辅助函数
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\$/g, '\\$')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\textasciitilde{}')
}
}