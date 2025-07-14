"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Github, MessageSquare, History, Send } from "lucide-react"
import type { Project } from "@/lib/types"
import { addComment } from "@/lib/storage"

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

const statusConfig = {
  planned: { label: "待规划", color: "bg-gray-200 text-gray-600" },
  planning: { label: "规划中", color: "bg-yellow-200 text-yellow-800" },
  developing: { label: "开发中", color: "bg-blue-200 text-blue-800" },
  completed: { label: "已完成", color: "bg-green-200 text-green-800" },
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [commentForm, setCommentForm] = useState({
    author: "",
    email: "",
    content: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentForm.author.trim() || !commentForm.content.trim()) return

    setIsSubmitting(true)
    try {
      await addComment({
        projectId: project.id,
        author: commentForm.author.trim(),
        email: commentForm.email.trim() || undefined,
        content: commentForm.content.trim(),
      })

      setCommentForm({ author: "", email: "", content: "" })
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error("提交留言失败:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">项目 #{project.id}</CardTitle>
            <Badge className={statusConfig[project.status].color}>{statusConfig[project.status].label}</Badge>
          </div>
          <h3 className="text-lg font-medium">{project.title}</h3>
          <p className="text-gray-600">{project.description}</p>
          {project.version && <div className="text-sm text-gray-500">当前版本: v{project.version}</div>}
        </CardHeader>

        <CardContent className="overflow-y-auto">
          {project.status === "completed" ? (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">项目信息</TabsTrigger>
                <TabsTrigger value="changelog">更新日志</TabsTrigger>
                <TabsTrigger value="feedback">留言反馈</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      查看演示
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      查看源码
                    </a>
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>创建时间:</strong>{" "}
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "未知"}
                  </p>
                  <p>
                    <strong>更新时间:</strong>{" "}
                    {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "未知"}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="changelog" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-4 h-4" />
                  <h4 className="font-medium">版本更新历史</h4>
                </div>
                {project.changelog && project.changelog.length > 0 ? (
                  <div className="space-y-3">
                    {project.changelog.map((log) => (
                      <div key={log.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                log.type === "major" ? "default" : log.type === "minor" ? "secondary" : "outline"
                              }
                            >
                              v{log.version}
                            </Badge>
                            <span className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ul className="text-sm space-y-1">
                          {log.changes.map((change, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-gray-400 mt-1">•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">暂无更新日志</p>
                )}
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4" />
                  <h4 className="font-medium">留言反馈</h4>
                </div>

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
                    留言提交成功！感谢您的反馈。
                  </div>
                )}

                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">姓名 *</Label>
                      <Input
                        id="author"
                        value={commentForm.author}
                        onChange={(e) => setCommentForm((prev) => ({ ...prev, author: e.target.value }))}
                        placeholder="请输入您的姓名"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="可选，用于回复"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="content">留言内容 *</Label>
                    <Textarea
                      id="content"
                      value={commentForm.content}
                      onChange={(e) => setCommentForm((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="请输入您的意见、建议或问题..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "提交中..." : "提交留言"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">该项目还在{statusConfig[project.status].label}阶段</p>
              <p className="text-sm text-gray-400">完成后将提供演示链接和源码</p>
            </div>
          )}

          <Button variant="outline" className="w-full mt-6 bg-transparent" onClick={onClose}>
            关闭
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
