'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  MessageSquare, 
  Target,
  ArrowDown,
  Eye,
  EyeOff
} from 'lucide-react';

interface AnalysisNode {
  id: string;
  question: string;
  answer: string;
  depth: number;
  parentId?: string;
  children: AnalysisNode[];
  timestamp: number;
}

interface AnalysisTreeProps {
  nodes: AnalysisNode[];
}

const AnalysisTree: React.FC<AnalysisTreeProps> = ({ nodes }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState(false);

  const toggleNodeExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getDepthColor = (depth: number) => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800', 
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-orange-100 border-orange-300 text-orange-800',
      'bg-red-100 border-red-300 text-red-800'
    ];
    return colors[depth] || colors[colors.length - 1];
  };

  const getDepthLabel = (depth: number) => {
    const labels = ['为什么1', '为什么2', '为什么3', '为什么4', '为什么5'];
    return labels[depth] || `为什么${depth + 1}`;
  };

  const renderNode = (node: AnalysisNode, index: number) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="relative">
        {/* 连接线 */}
        {index > 0 && (
          <div className="absolute -top-4 left-6 w-0.5 h-4 bg-gray-300" />
        )}
        
        <div className={`ml-${node.depth * 4} mb-4`}>
          <div className={`
            border rounded-lg p-4 transition-all duration-200
            ${getDepthColor(node.depth)}
            ${showDetails ? 'shadow-md' : 'shadow-sm'}
          `}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {getDepthLabel(node.depth)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(node.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {showDetails && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">AI问题：</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-white/50 p-2 rounded border">
                      {node.question}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">回答：</span>
                </div>
                <p className="text-sm text-gray-800 font-medium">
                  {node.answer}
                </p>
              </div>
              
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleNodeExpansion(node.id)}
                  className="ml-2"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {/* 箭头指向下一层 */}
          {index < nodes.length - 1 && (
            <div className="flex justify-center my-2">
              <div className="flex flex-col items-center">
                <ArrowDown className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">深入分析</span>
              </div>
            </div>
          )}
          
          {/* 子节点 */}
          {hasChildren && isExpanded && (
            <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
              {node.children.map((childNode, childIndex) => 
                renderNode(childNode, childIndex)
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            分析进度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">开始回答AI的问题，分析树将在这里显示</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            5Why分析树
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2"
          >
            {showDetails ? (
              <>
                <EyeOff className="w-4 h-4" />
                简化视图
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                详细视图
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>分析深度: {nodes.length} 层</span>
          <span>•</span>
          <span>最新更新: {new Date(Math.max(...nodes.map(n => n.timestamp))).toLocaleTimeString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {nodes.map((node, index) => renderNode(node, index))}
        </div>
        
        {/* 分析深度统计 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">分析层次统计</h4>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map(depth => {
              const count = nodes.filter(n => n.depth === depth).length;
              return (
                <div key={depth} className="text-center">
                  <div className={`w-full h-2 rounded ${
                    count > 0 ? getDepthColor(depth).split(' ')[0] : 'bg-gray-200'
                  }`} />
                  <span className="text-xs text-gray-500 mt-1 block">
                    {getDepthLabel(depth)}
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {count}个回答
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisTree;