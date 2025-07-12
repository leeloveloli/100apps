'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRightLeft, Copy, FileText, RotateCcw, Download, ArrowUpDown } from 'lucide-react'
import { convertData, formatInfo, type DataFormat } from './utils'

export default function CodeConverter() {
  const [sourceFormat, setSourceFormat] = useState<DataFormat>('json')
  const [targetFormat, setTargetFormat] = useState<DataFormat>('yaml')
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [error, setError] = useState('')
  const [isConverting, setIsConverting] = useState(false)

  // 格式分类定义
  const formatCategories = {
    data: ['json', 'yaml', 'xml', 'csv', 'base64'],
    markup: ['markdown', 'html', 'latex', 'rst'],
    programming: ['javascript', 'typescript', 'python', 'go', 'java', 'csharp', 'php', 'rust', 'swift', 'cpp']
  }

  // 获取格式所属分类
  const getFormatCategory = (format: DataFormat) => {
    for (const [category, formats] of Object.entries(formatCategories)) {
      if (formats.includes(format)) {
        return category
      }
    }
    return 'data'
  }

  // 获取可用的目标格式（同一分类内的格式）
  const getAvailableTargetFormats = () => {
    const sourceCategory = getFormatCategory(sourceFormat)
    return formatCategories[sourceCategory as keyof typeof formatCategories] || formatCategories.data
  }

  // 实时转换
  const handleConvert = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText('')
      setError('')
      return
    }

    setIsConverting(true)
    setError('')

    try {
      const result = convertData(inputText, sourceFormat, targetFormat)
      
      if (result.success) {
        setOutputText(result.data || '')
        setError('')
      } else {
        setError(result.error || '转换失败')
        setOutputText('')
      }
    } catch (err) {
      setError(`转换出错: ${err instanceof Error ? err.message : '未知错误'}`)
      setOutputText('')
    } finally {
      setIsConverting(false)
    }
  }, [inputText, sourceFormat, targetFormat])

  // 输入变化时自动转换
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.trim()) {
        handleConvert()
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [inputText, sourceFormat, targetFormat, handleConvert])

  // 源格式变化时，自动调整目标格式到同一分类
  useEffect(() => {
    const availableTargets = getAvailableTargetFormats()
    if (!availableTargets.includes(targetFormat)) {
      // 如果当前目标格式不在同一分类中，选择第一个可用的格式（排除源格式本身）
      const newTarget = availableTargets.find(f => f !== sourceFormat) || availableTargets[0]
      setTargetFormat(newTarget as DataFormat)
    }
  }, [sourceFormat, targetFormat, getAvailableTargetFormats])

  // 交换格式
  const swapFormats = () => {
    setSourceFormat(targetFormat)
    setTargetFormat(sourceFormat)
    setInputText(outputText)
    setOutputText('')
  }

  // 复制结果
  const copyResult = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText)
    }
  }

  // 清空内容
  const clearAll = () => {
    setInputText('')
    setOutputText('')
    setError('')
  }

  // 加载示例
  const loadExample = () => {
    const example = formatInfo[sourceFormat].example
    setInputText(example)
  }

  // 下载结果
  const downloadResult = () => {
    if (outputText) {
      const blob = new Blob([outputText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `converted.${targetFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const formats = Object.values(formatInfo)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔄 代码转换器</h1>
          <p className="text-xl text-gray-600 mb-2">
            支持数据格式：JSON • YAML • XML • CSV • Base64
          </p>
          <p className="text-xl text-gray-600 mb-2">
            支持标记语言：Markdown • HTML • LaTeX • reStructuredText
          </p>
          <p className="text-xl text-gray-600 mb-2">
            支持编程语言：JavaScript • TypeScript • Python • Go • Java • C# • PHP • Rust • Swift • C++
          </p>
          <p className="text-gray-500">
            开发者必备工具，分类内互转，实时预览，一键复制
          </p>
        </div>

        {/* 格式选择区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              格式转换设置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">从:</label>
                <Select value={sourceFormat} onValueChange={(value) => setSourceFormat(value as DataFormat)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 border-b">数据格式</div>
                    {formats.filter(f => formatCategories.data.includes(f.id)).map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.name}
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 border-b mt-1">标记语言</div>
                    {formats.filter(f => formatCategories.markup.includes(f.id)).map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.name}
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 border-b mt-1">编程语言</div>
                    {formats.filter(f => formatCategories.programming.includes(f.id)).map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={swapFormats}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                交换
              </Button>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">到:</label>
                <Select value={targetFormat} onValueChange={(value) => setTargetFormat(value as DataFormat)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const availableFormats = getAvailableTargetFormats()
                      const category = getFormatCategory(sourceFormat)
                      const categoryNames = {
                        data: '数据格式',
                        markup: '标记语言',
                        programming: '编程语言'
                      }
                      
                      return (
                        <>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 border-b">
                            {categoryNames[category as keyof typeof categoryNames]}
                          </div>
                          {formats.filter(f => availableFormats.includes(f.id)).map((format) => (
                            <SelectItem key={format.id} value={format.id}>
                              {format.name}
                            </SelectItem>
                          ))}
                        </>
                      )
                    })()}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm" onClick={loadExample}>
                  <FileText className="w-4 h-4 mr-2" />
                  示例
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  清空
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 转换区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 输入区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📝 输入 ({formatInfo[sourceFormat].name})</span>
                <span className="text-sm font-normal text-gray-500">
                  {formatInfo[sourceFormat].description}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`请输入 ${formatInfo[sourceFormat].name} 格式的数据...`}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </CardContent>
          </Card>

          {/* 输出区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📋 输出 ({formatInfo[targetFormat].name})</span>
                <div className="flex gap-2">
                  {outputText && (
                    <>
                      <Button variant="outline" size="sm" onClick={copyResult}>
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadResult}>
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={outputText}
                readOnly
                placeholder={isConverting ? '转换中...' : `转换后的 ${formatInfo[targetFormat].name} 格式数据将显示在这里`}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </CardContent>
          </Card>
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              ❌ {error}
            </AlertDescription>
          </Alert>
        )}

        {/* 成功提示 */}
        {outputText && !error && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              ✅ 转换成功！已生成 {outputText.split('\n').length} 行输出
            </AlertDescription>
          </Alert>
        )}

        {/* 支持的格式说明 */}
        <Card>
          <CardHeader>
            <CardTitle>📊 支持的格式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 数据格式 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">💾 数据格式</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formats.filter(f => formatCategories.data.includes(f.id)).map((format) => (
                    <div key={format.id} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <h4 className="font-semibold text-lg mb-2">{format.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{format.description}</p>
                      <div className="text-xs bg-white p-2 rounded font-mono overflow-x-auto">
                        {format.example.slice(0, 100)}
                        {format.example.length > 100 && '...'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 标记语言 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">📝 标记语言</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formats.filter(f => formatCategories.markup.includes(f.id)).map((format) => (
                    <div key={format.id} className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                      <h4 className="font-semibold text-lg mb-2">{format.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{format.description}</p>
                      <div className="text-xs bg-white p-2 rounded font-mono overflow-x-auto">
                        {format.example.slice(0, 150)}
                        {format.example.length > 150 && '...'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 编程语言 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">💻 编程语言</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {formats.filter(f => formatCategories.programming.includes(f.id)).map((format) => (
                    <div key={format.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                      <h4 className="font-semibold text-lg mb-2">{format.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{format.description}</p>
                      <div className="text-xs bg-white p-2 rounded font-mono overflow-x-auto">
                        {format.example.slice(0, 120)}
                        {format.example.length > 120 && '...'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📖 使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">基本操作：</h4>
                <ul className="space-y-1">
                  <li>• 选择源格式和目标格式</li>
                  <li>• 在左侧输入框粘贴或输入代码</li>
                  <li>• 系统会自动实时转换并显示结果</li>
                  <li>• 点击"复制"按钮复制转换结果</li>
                  <li>• 点击"示例"查看格式示例</li>
                  <li>• 只能在同一分类内转换</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">数据格式转换：</h4>
                <ul className="space-y-1">
                  <li>• JSON ↔ YAML ↔ XML ↔ CSV</li>
                  <li>• 任意格式 → Base64 编码</li>
                  <li>• Base64 → 解码为原始文本</li>
                  <li>• 智能错误检测和提示</li>
                  <li>• 支持复杂嵌套数据结构</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">标记语言转换：</h4>
                <ul className="space-y-1">
                  <li>• Markdown ↔ HTML ↔ LaTeX</li>
                  <li>• reStructuredText 互转</li>
                  <li>• 保留基本格式和结构</li>
                  <li>• 支持标题、列表、链接转换</li>
                  <li>• 文档格式无缝切换</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">编程语言转换：</h4>
                <ul className="space-y-1">
                  <li>• JavaScript ↔ TypeScript ↔ Python</li>
                  <li>• Go ↔ Java ↔ C# ↔ PHP</li>
                  <li>• Rust ↔ Swift ↔ C++</li>
                  <li>• 保留代码逻辑和结构</li>
                  <li>• 智能语法适配转换</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}