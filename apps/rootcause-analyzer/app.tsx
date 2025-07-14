'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, Search, FileText } from 'lucide-react';
import ProblemInput from './components/ProblemInput';
import AnalysisFlow from './components/AnalysisFlow';
import AnalysisTree from './components/AnalysisTree';
import ResultsPanel from './components/ResultsPanel';
import { rootcauseAnalyzerConfig } from './config';

interface AnalysisNode {
  id: string;
  question: string;
  answer: string;
  depth: number;
  parentId?: string;
  children: AnalysisNode[];
  timestamp: number;
}

interface AnalysisSession {
  id: string;
  originalProblem: string;
  nodes: AnalysisNode[];
  currentNode?: AnalysisNode;
  status: 'input' | 'analyzing' | 'completed';
  insights: string[];
  rootCauses: string[];
  solutions: string[];
}

export default function RootCauseAnalyzerApp() {
  const [session, setSession] = useState<AnalysisSession>({
    id: Date.now().toString(),
    originalProblem: '',
    nodes: [],
    status: 'input',
    insights: [],
    rootCauses: [],
    solutions: []
  });

  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Target, title: '问题定义', desc: '描述你要分析的问题' },
    { icon: Search, title: '深度分析', desc: 'AI引导5Why分析' },
    { icon: Lightbulb, title: '洞察发现', desc: '识别根本原因' },
    { icon: FileText, title: '结果报告', desc: '生成分析报告' }
  ];

  const handleProblemSubmit = (problem: string) => {
    setSession(prev => ({
      ...prev,
      originalProblem: problem,
      status: 'analyzing'
    }));
    setCurrentStep(1);
  };

  const handleAnalysisComplete = (
    nodes: AnalysisNode[], 
    insights: string[], 
    rootCauses: string[], 
    solutions: string[]
  ) => {
    setSession(prev => ({
      ...prev,
      nodes,
      insights,
      rootCauses,
      solutions,
      status: 'completed'
    }));
    setCurrentStep(3);
  };

  const handleRestart = () => {
    setSession({
      id: Date.now().toString(),
      originalProblem: '',
      nodes: [],
      status: 'input',
      insights: [],
      rootCauses: [],
      solutions: []
    });
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🔍 RootCause AI
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            AI驱动的智能根因分析工具 - 用5Why方法发现问题的根本原因
          </p>
          
          {/* 进度指示器 */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex flex-col items-center ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${
                      isActive ? 'border-blue-600 bg-blue-50' : 
                      isCompleted ? 'border-green-600 bg-green-50' : 
                      'border-gray-300 bg-gray-50'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                    <span className="text-xs text-gray-500">{step.desc}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > index ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-6xl mx-auto">
          {session.status === 'input' && (
            <ProblemInput onSubmit={handleProblemSubmit} />
          )}

          {session.status === 'analyzing' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      原始问题
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 p-4 bg-gray-50 rounded-lg">
                      {session.originalProblem}
                    </p>
                  </CardContent>
                </Card>
                
                <AnalysisFlow 
                  originalProblem={session.originalProblem}
                  onComplete={handleAnalysisComplete}
                />
              </div>
              
              <div>
                <AnalysisTree nodes={session.nodes} />
              </div>
            </div>
          )}

          {session.status === 'completed' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      分析完成
                    </span>
                    <Button onClick={handleRestart} variant="outline">
                      重新分析
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <ResultsPanel 
                        originalProblem={session.originalProblem}
                        insights={session.insights}
                        rootCauses={session.rootCauses}
                        solutions={session.solutions}
                      />
                    </div>
                    <div>
                      <AnalysisTree nodes={session.nodes} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>基于5Why方法论 • AI智能引导 • 系统性问题分析</p>
        </div>
      </div>
    </div>
  );
}

export { rootcauseAnalyzerConfig as config };