"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowRight, Lock, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function AdminPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">管理员门户</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            欢迎来到100个应用项目的管理后台入口，这里可以管理所有项目的状态、查看用户反馈和维护版本日志。
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>项目管理</CardTitle>
                <CardDescription>管理100个应用项目的状态、链接和详细信息</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 更新项目状态</li>
                  <li>• 添加演示和源码链接</li>
                  <li>• 编辑项目信息</li>
                  <li>• 数据导入导出</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>留言管理</CardTitle>
                <CardDescription>查看和管理用户对已完成项目的反馈留言</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 查看用户留言</li>
                  <li>• 标记已读/未读</li>
                  <li>• 按项目筛选</li>
                  <li>• 留言统计分析</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lock className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>版本日志</CardTitle>
                <CardDescription>维护每个项目的版本更新历史和变更记录</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 添加版本更新</li>
                  <li>• 记录变更内容</li>
                  <li>• 版本类型管理</li>
                  <li>• 更新历史追踪</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="text-center">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">准备好开始管理了吗？</h3>
              <p className="text-gray-600 mb-6">点击下方按钮进入管理后台，开始管理您的项目。</p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin">
                  <Shield className="w-4 h-4 mr-2" />
                  进入管理后台
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
