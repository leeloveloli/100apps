// 数据格式类型定义
export type DataFormat = 'json' | 'yaml' | 'xml' | 'csv' | 'base64'

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
      case 'base64':
        return { success: true, data: base64Str }
      default:
        return { success: false, error: '不支持的目标格式' }
    }
  } catch (error) {
    return { success: false, error: `Base64解码错误: ${error instanceof Error ? error.message : '未知错误'}` }
  }
}

// 主转换函数
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