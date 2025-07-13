'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Lightbulb, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AnalysisNode {
  id: string;
  question: string;
  answer: string;
  depth: number;
  parentId?: string;
  children: AnalysisNode[];
  timestamp: number;
}

interface AnalysisFlowProps {
  originalProblem: string;
  onComplete: (
    nodes: AnalysisNode[], 
    insights: string[], 
    rootCauses: string[], 
    solutions: string[]
  ) => void;
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: number;
}

const AnalysisFlow: React.FC<AnalysisFlowProps> = ({ originalProblem, onComplete }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [nodes, setNodes] = useState<AnalysisNode[]>([]);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // 初始化第一个问题
  useEffect(() => {
    setTimeout(() => {
      generateFirstQuestion();
    }, 1000);
  }, [originalProblem]);

  // 生成第一个问题
  const generateFirstQuestion = () => {
    const firstQuestion = generateAIQuestion(originalProblem, 0, []);
    
    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: firstQuestion,
      timestamp: Date.now()
    };

    setMessages([aiMessage]);
  };

  // AI问题生成逻辑（简化版本，实际应该调用真实AI服务）
  const generateAIQuestion = (context: string, depth: number, previousAnswers: string[]): string => {
    // 这里是模拟的AI问题生成逻辑
    // 在实际项目中，这里应该调用OpenAI或其他AI服务
    
    const questionTemplates = [
      // 第一层问题
      [
        `为什么会出现这个问题？请从直接原因开始分析。`,
        `这个问题最直接的原因是什么？`,
        `从你的观察来看，导致这个问题的直接因素有哪些？`
      ],
      // 第二层问题
      [
        `你刚才提到的原因，为什么会发生？`,
        `是什么导致了刚才你说的那个情况？`,
        `再深入一点，为什么会出现你刚才描述的原因？`
      ],
      // 第三层问题
      [
        `继续追问：为什么会出现这个根本性问题？`,
        `这个原因背后还有什么更深层的因素吗？`,
        `从系统的角度看，为什么会有这样的情况？`
      ],
      // 第四层问题
      [
        `让我们再深入一层：为什么会存在这样的系统性问题？`,
        `这是否反映了更根本的流程或制度问题？`,
        `从管理或文化的角度，为什么会这样？`
      ],
      // 第五层问题
      [
        `最后，我们来探讨最根本的原因：为什么会有这样的根本性缺陷？`,
        `这是否涉及到最基础的理念或策略问题？`,
        `从长远角度看，这个根源问题为什么会产生？`
      ]
    ];

    if (depth < questionTemplates.length) {
      const templates = questionTemplates[depth];
      return templates[Math.floor(Math.random() * templates.length)];
    }

    return "基于我们的分析，我认为我们已经接近核心问题了。你觉得还有其他需要探讨的角度吗？";
  };

  // 处理用户回答
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error('请输入您的回答');
      return;
    }

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentAnswer.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);

    // 创建分析节点
    const newNode: AnalysisNode = {
      id: Date.now().toString(),
      question: messages[messages.length - 1]?.content || '',
      answer: currentAnswer.trim(),
      depth: currentDepth,
      children: [],
      timestamp: Date.now()
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);

    setCurrentAnswer('');
    setIsThinking(true);

    // 模拟AI思考时间
    setTimeout(() => {
      setIsThinking(false);
      
      // 检查是否应该结束分析
      if (currentDepth >= 4 || shouldEndAnalysis(updatedNodes)) {
        completeAnalysis(updatedNodes);
      } else {
        // 生成下一个问题
        const nextQuestion = generateAIQuestion(
          originalProblem, 
          currentDepth + 1, 
          updatedNodes.map(n => n.answer)
        );

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: nextQuestion,
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, aiMessage]);
        setCurrentDepth(prev => prev + 1);
      }
    }, 2000);
  };

  // 判断是否应该结束分析
  const shouldEndAnalysis = (nodes: AnalysisNode[]): boolean => {
    // 简化的结束条件判断
    if (nodes.length >= 3) {
      const lastAnswer = nodes[nodes.length - 1]?.answer || '';
      // 如果用户的回答表明已经找到根本原因
      const rootCauseIndicators = ['根本', '核心', '本质', '制度', '文化', '策略', '理念'];
      return rootCauseIndicators.some(indicator => lastAnswer.includes(indicator));
    }
    return false;
  };

  // 完成分析
  const completeAnalysis = (finalNodes: AnalysisNode[]) => {
    setIsCompleted(true);

    // 生成洞察、根因和解决方案（模拟）
    const insights = generateInsights(finalNodes);
    const rootCauses = extractRootCauses(finalNodes);
    const solutions = generateSolutions(finalNodes);

    setTimeout(() => {
      onComplete(finalNodes, insights, rootCauses, solutions);
    }, 1000);
  };

  // 生成洞察
  const generateInsights = (nodes: AnalysisNode[]): string[] => {
    return [
      '问题分析显示了多层次的因果关系',
      '从表面症状到根本原因存在明显的递进关系',
      '需要从系统性角度来解决问题',
      '预防措施比事后补救更重要'
    ];
  };

  // 提取根本原因
  const extractRootCauses = (nodes: AnalysisNode[]): string[] => {
    // 简化的根因提取逻辑
    const deepestNodes = nodes.filter(n => n.depth >= 2);
    return deepestNodes.map(n => n.answer);
  };

  // 生成解决方案
  const generateSolutions = (nodes: AnalysisNode[]): string[] => {
    return [
      '针对根本原因制定系统性解决方案',
      '建立预防机制避免问题再次发生',
      '改善相关流程和制度',
      '加强监控和早期预警'
    ];
  };

  if (isCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            分析完成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">5Why分析已完成</h3>
            <p className="text-gray-600 mb-4">
              我们通过 {nodes.length} 轮深入分析，发现了问题的根本原因
            </p>
            <Badge className="bg-green-100 text-green-800">
              分析深度：{Math.max(...nodes.map(n => n.depth)) + 1} 层
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          AI引导分析
          <Badge variant="outline">第 {currentDepth + 1} 层</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 对话历史 */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'ai' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {message.type === 'ai' ? (
                    <Bot className="w-4 h-4 text-blue-600" />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`p-3 rounded-lg ${
                  message.type === 'ai' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* AI思考中 */}
          {isThinking && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-blue-600">AI正在分析您的回答...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 回答输入区 */}
        {!isThinking && messages.length > 0 && messages[messages.length - 1].type === 'ai' && (
          <div className="space-y-3">
            <Textarea
              placeholder="请详细回答上面的问题，提供具体的情况和背景信息..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                💡 提示：越详细的回答，AI越能帮您深入分析
              </p>
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                提交回答
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisFlow;