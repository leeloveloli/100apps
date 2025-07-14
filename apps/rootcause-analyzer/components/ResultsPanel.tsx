'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Lightbulb, 
  Target, 
  CheckCircle, 
  Download, 
  Share2,
  Copy,
  Star,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface ResultsPanelProps {
  originalProblem: string;
  insights: string[];
  rootCauses: string[];
  solutions: string[];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  originalProblem, 
  insights, 
  rootCauses, 
  solutions 
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'causes' | 'solutions' | 'report'>('insights');
  const [customNotes, setCustomNotes] = useState('');

  const tabs = [
    { id: 'insights', label: '关键洞察', icon: Lightbulb, count: insights.length },
    { id: 'causes', label: '根本原因', icon: Target, count: rootCauses.length },
    { id: 'solutions', label: '解决方案', icon: CheckCircle, count: solutions.length },
    { id: 'report', label: '完整报告', icon: Download, count: 0 }
  ];

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('内容已复制到剪贴板');
  };

  const generateReport = () => {
    const report = `
5Why根因分析报告
====================

原始问题：
${originalProblem}

关键洞察：
${insights.map((insight, index) => `${index + 1}. ${insight}`).join('\n')}

根本原因：
${rootCauses.map((cause, index) => `${index + 1}. ${cause}`).join('\n')}

建议解决方案：
${solutions.map((solution, index) => `${index + 1}. ${solution}`).join('\n')}

附加说明：
${customNotes || '无'}

生成时间：${new Date().toLocaleString()}
`.trim();
    
    return report;
  };

  const handleDownloadReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `5Why分析报告_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('报告已下载');
  };

  const handleShareReport = () => {
    const report = generateReport();
    handleCopyContent(report);
    toast.success('完整报告已复制，可以分享给团队');
  };

  const renderInsights = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          关键洞察
        </h3>
        <Badge className="bg-yellow-100 text-yellow-800">
          {insights.length} 项洞察
        </Badge>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{insight}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyContent(insight)}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    复制
                  </Button>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRootCauses = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-red-500" />
          根本原因
        </h3>
        <Badge className="bg-red-100 text-red-800">
          {rootCauses.length} 个根因
        </Badge>
      </div>
      
      <div className="space-y-3">
        {rootCauses.map((cause, index) => (
          <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{cause}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    高优先级
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyContent(cause)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    复制
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="font-medium text-orange-800">重要提示</span>
        </div>
        <p className="text-sm text-orange-700">
          这些根本原因需要系统性的解决方案。建议优先处理影响范围最大的原因。
        </p>
      </div>
    </div>
  );

  const renderSolutions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          解决方案
        </h3>
        <Badge className="bg-green-100 text-green-800">
          {solutions.length} 个方案
        </Badge>
      </div>
      
      <div className="space-y-3">
        {solutions.map((solution, index) => (
          <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{solution}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    建议实施
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyContent(solution)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    复制
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-blue-800">实施建议</span>
        </div>
        <p className="text-sm text-blue-700">
          建议按优先级实施解决方案，同时建立监控机制确保问题不再复发。
        </p>
      </div>
    </div>
  );

  const renderReport = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-500" />
          完整报告
        </h3>
        <div className="flex gap-2">
          <Button onClick={handleShareReport} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            分享
          </Button>
          <Button onClick={handleDownloadReport} size="sm">
            <Download className="w-4 h-4 mr-2" />
            下载
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{insights.length}</div>
              <div className="text-sm text-gray-600">关键洞察</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{rootCauses.length}</div>
              <div className="text-sm text-gray-600">根本原因</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{solutions.length}</div>
              <div className="text-sm text-gray-600">解决方案</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">添加备注或补充信息：</h4>
          <Textarea
            placeholder="记录你的额外思考、实施计划或其他重要信息..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">报告摘要预览：</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>原始问题：</strong> {originalProblem.substring(0, 100)}...</p>
            <p><strong>分析深度：</strong> 通过5Why方法发现了 {rootCauses.length} 个根本原因</p>
            <p><strong>解决方案：</strong> 提供了 {solutions.length} 个可行的解决方案</p>
            <p><strong>生成时间：</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          分析结果
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 标签页导航 */}
        <div className="flex space-x-1 mb-6 p-1 bg-gray-100 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* 内容区域 */}
        <div className="min-h-[400px]">
          {activeTab === 'insights' && renderInsights()}
          {activeTab === 'causes' && renderRootCauses()}
          {activeTab === 'solutions' && renderSolutions()}
          {activeTab === 'report' && renderReport()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsPanel;