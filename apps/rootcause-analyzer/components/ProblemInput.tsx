'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ProblemInputProps {
  onSubmit: (problem: string) => void;
}

interface QualityCheck {
  score: number;
  issues: string[];
  suggestions: string[];
}

const ProblemInput: React.FC<ProblemInputProps> = ({ onSubmit }) => {
  const [problem, setProblem] = useState('');
  const [qualityCheck, setQualityCheck] = useState<QualityCheck | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 问题质量检测
  const checkProblemQuality = (text: string): QualityCheck => {
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;
    
    let score = 0;
    const issues: string[] = [];
    const suggestions: string[] = [];

    // 长度检查
    if (wordCount < 10) {
      issues.push('问题描述过于简短');
      suggestions.push('请提供更多细节和背景信息');
    } else if (wordCount > 100) {
      issues.push('问题描述过于冗长');
      suggestions.push('请尝试简化和聚焦核心问题');
    } else {
      score += 2;
    }

    // 具体性检查
    const vagueWords = ['有些', '一些', '可能', '似乎', '好像', '大概'];
    const hasVagueWords = vagueWords.some(word => text.includes(word));
    if (hasVagueWords) {
      issues.push('描述不够具体');
      suggestions.push('尝试使用更具体的表述，避免模糊词汇');
    } else {
      score += 2;
    }

    // 时间信息检查
    const timeWords = ['昨天', '上周', '最近', '今天', '本月', '去年'];
    const hasTimeInfo = timeWords.some(word => text.includes(word));
    if (hasTimeInfo) {
      score += 1;
    } else {
      suggestions.push('考虑添加时间信息（何时发生的）');
    }

    // 影响范围检查
    const impactWords = ['影响', '导致', '造成', '结果', '后果'];
    const hasImpactInfo = impactWords.some(word => text.includes(word));
    if (hasImpactInfo) {
      score += 1;
    } else {
      suggestions.push('描述一下问题造成的影响');
    }

    // 问题vs症状检查
    const symptomWords = ['慢', '卡', '错误', '失败', '不能', '无法'];
    const hasSymptoms = symptomWords.some(word => text.includes(word));
    if (hasSymptoms && !text.includes('为什么')) {
      suggestions.push('这看起来像是症状，思考一下为什么会出现这种情况');
    }

    return { score, issues, suggestions };
  };

  const handleTextChange = (text: string) => {
    setProblem(text);
    
    if (text.trim().length > 20) {
      const quality = checkProblemQuality(text);
      setQualityCheck(quality);
    } else {
      setQualityCheck(null);
    }
  };

  const handleSubmit = async () => {
    if (problem.trim().length < 10) {
      toast.error('请提供更详细的问题描述');
      return;
    }

    setIsAnalyzing(true);
    
    // 模拟提交处理
    setTimeout(() => {
      onSubmit(problem.trim());
      setIsAnalyzing(false);
    }, 1000);
  };

  const getQualityColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 4) return '优秀';
    if (score >= 2) return '良好';
    return '需要改进';
  };

  // 示例问题
  const exampleProblems = [
    {
      title: '项目延期',
      problem: '我们的移动应用开发项目原计划上个月完成，但到现在仍未上线，已经延期了3周，影响了产品发布计划。'
    },
    {
      title: '客户投诉',
      problem: '最近一周收到多个客户投诉，反映网站加载速度很慢，平均加载时间超过10秒，导致用户体验下降。'
    },
    {
      title: '团队效率',
      problem: '团队这个月的工作效率明显下降，原本一天能完成的任务现在需要两天，项目进度受到影响。'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            第一步：描述你要分析的问题
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="problem" className="text-base font-medium mb-3 block">
              请详细描述问题的具体情况
            </Label>
            <Textarea
              id="problem"
              placeholder="例如：我们的网站最近一周加载速度很慢，平均响应时间从2秒增加到了10秒，导致用户投诉增加，转化率下降了15%..."
              value={problem}
              onChange={(e) => handleTextChange(e.target.value)}
              className="min-h-[120px] text-base"
            />
            <p className="text-sm text-gray-500 mt-2">
              提示：提供越多的背景信息和具体细节，AI越能帮助你进行深入分析
            </p>
          </div>

          {/* 问题质量检测 */}
          {qualityCheck && (
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">问题质量评估</h4>
                  <Badge className={getQualityColor(qualityCheck.score)}>
                    {getQualityLabel(qualityCheck.score)} ({qualityCheck.score}/5)
                  </Badge>
                </div>
                
                {qualityCheck.issues.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-orange-700">需要注意：</span>
                    </div>
                    <ul className="text-sm text-orange-600 space-y-1 ml-6">
                      {qualityCheck.issues.map((issue, index) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {qualityCheck.suggestions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">建议：</span>
                    </div>
                    <ul className="text-sm text-blue-600 space-y-1 ml-6">
                      {qualityCheck.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              disabled={problem.trim().length < 10 || isAnalyzing}
              size="lg"
              className="px-8"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  处理中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  开始5Why分析
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 示例问题 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 示例问题</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exampleProblems.map((example, index) => (
              <div 
                key={index}
                onClick={() => handleTextChange(example.problem)}
                className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <h4 className="font-medium text-blue-600 mb-2">{example.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{example.problem}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemInput;