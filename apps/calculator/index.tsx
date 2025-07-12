'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForNext, setWaitingForNext] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  // 清空计算器
  const clear = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNext(false)
  }, [])

  // 输入数字
  const inputNumber = useCallback((num: string) => {
    if (waitingForNext) {
      setDisplay(num)
      setWaitingForNext(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }, [display, waitingForNext])

  // 输入小数点
  const inputDot = useCallback(() => {
    if (waitingForNext) {
      setDisplay('0.')
      setWaitingForNext(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }, [display, waitingForNext])

  // 输入运算符
  const inputOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForNext(true)
    setOperation(nextOperation)
  }, [display, previousValue, operation])

  // 计算结果
  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      default:
        return secondValue
    }
  }

  // 执行计算
  const performCalculation = useCallback(() => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`
      
      setHistory(prev => [calculation, ...prev.slice(0, 9)]) // 保留最近10条记录
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNext(true)
    }
  }, [display, previousValue, operation])

  // 键盘支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputNumber(e.key)
      } else if (e.key === '.') {
        inputDot()
      } else if (e.key === '+') {
        inputOperation('+')
      } else if (e.key === '-') {
        inputOperation('-')
      } else if (e.key === '*') {
        inputOperation('×')
      } else if (e.key === '/') {
        e.preventDefault()
        inputOperation('÷')
      } else if (e.key === 'Enter' || e.key === '=') {
        performCalculation()
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clear()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [inputNumber, inputDot, inputOperation, performCalculation, clear])

  const buttonClass = "h-16 text-lg font-semibold transition-all hover:scale-105"
  const numberButtonClass = `${buttonClass} bg-gray-100 hover:bg-gray-200`
  const operatorButtonClass = `${buttonClass} bg-blue-500 hover:bg-blue-600 text-white`
  const specialButtonClass = `${buttonClass} bg-gray-300 hover:bg-gray-400`

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🧮 在线计算器</h1>
          <p className="text-gray-600">支持键盘操作</p>
        </div>

        <Card className="p-6 shadow-2xl">
          {/* 显示屏 */}
          <div className="mb-4">
            <div className="bg-gray-900 text-white p-4 rounded-lg text-right">
              <div className="text-3xl font-mono font-bold min-h-[40px] break-all">
                {display}
              </div>
              {operation && previousValue !== null && (
                <div className="text-sm text-gray-400 mt-1">
                  {previousValue} {operation}
                </div>
              )}
            </div>
          </div>

          {/* 按钮区域 */}
          <div className="grid grid-cols-4 gap-3">
            {/* 第一行 */}
            <Button onClick={clear} className={`${specialButtonClass} col-span-2`}>
              清空 (C)
            </Button>
            <Button onClick={() => setDisplay(display.slice(0, -1) || '0')} className={specialButtonClass}>
              ⌫
            </Button>
            <Button onClick={() => inputOperation('÷')} className={operatorButtonClass}>
              ÷
            </Button>

            {/* 第二行 */}
            <Button onClick={() => inputNumber('7')} className={numberButtonClass}>7</Button>
            <Button onClick={() => inputNumber('8')} className={numberButtonClass}>8</Button>
            <Button onClick={() => inputNumber('9')} className={numberButtonClass}>9</Button>
            <Button onClick={() => inputOperation('×')} className={operatorButtonClass}>×</Button>

            {/* 第三行 */}
            <Button onClick={() => inputNumber('4')} className={numberButtonClass}>4</Button>
            <Button onClick={() => inputNumber('5')} className={numberButtonClass}>5</Button>
            <Button onClick={() => inputNumber('6')} className={numberButtonClass}>6</Button>
            <Button onClick={() => inputOperation('-')} className={operatorButtonClass}>-</Button>

            {/* 第四行 */}
            <Button onClick={() => inputNumber('1')} className={numberButtonClass}>1</Button>
            <Button onClick={() => inputNumber('2')} className={numberButtonClass}>2</Button>
            <Button onClick={() => inputNumber('3')} className={numberButtonClass}>3</Button>
            <Button onClick={() => inputOperation('+')} className={operatorButtonClass}>+</Button>

            {/* 第五行 */}
            <Button onClick={() => inputNumber('0')} className={`${numberButtonClass} col-span-2`}>
              0
            </Button>
            <Button onClick={inputDot} className={numberButtonClass}>.</Button>
            <Button onClick={performCalculation} className={`${operatorButtonClass} bg-green-500 hover:bg-green-600`}>
              =
            </Button>
          </div>
        </Card>

        {/* 历史记录 */}
        {history.length > 0 && (
          <Card className="mt-4 p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">计算历史</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {history.map((item, index) => (
                <div key={index} className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                  {item}
                </div>
              ))}
            </div>
            <Button 
              onClick={() => setHistory([])} 
              className="mt-3 w-full"
              variant="outline"
              size="sm"
            >
              清空历史
            </Button>
          </Card>
        )}

        {/* 使用说明 */}
        <Card className="mt-4 p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">使用说明</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 支持鼠标点击和键盘输入</li>
            <li>• 按 C 或 Esc 清空计算器</li>
            <li>• 按 Enter 或 = 执行计算</li>
            <li>• 支持连续计算</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}