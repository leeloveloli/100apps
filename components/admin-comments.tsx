"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Search, Mail, Calendar, Eye, EyeOff } from "lucide-react"
import { loadComments, saveComments } from "@/lib/storage"
import type { Comment } from "@/lib/types"

export function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">("all")

  useEffect(() => {
    setComments(loadComments())
  }, [])

  const handleMarkAsRead = (commentId: string, isRead: boolean) => {
    const updatedComments = comments.map((comment) => (comment.id === commentId ? { ...comment, isRead } : comment))
    setComments(updatedComments)
    saveComments(updatedComments)
  }

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.projectId.toString().includes(searchTerm)

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "read" && comment.isRead) ||
      (filterStatus === "unread" && !comment.isRead)

    return matchesSearch && matchesStatus
  })

  const unreadCount = comments.filter((c) => !c.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          <h2 className="text-2xl font-bold">留言管理</h2>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount} 条未读</Badge>}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{comments.length}</div>
            <div className="text-sm text-gray-600">总留言数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{comments.filter((c) => c.isRead).length}</div>
            <div className="text-sm text-gray-600">已读留言</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">未读留言</div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索留言..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(value: "all" | "read" | "unread") => setFilterStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部留言</SelectItem>
            <SelectItem value="unread">未读留言</SelectItem>
            <SelectItem value="read">已读留言</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 留言列表 */}
      <div className="space-y-4">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <Card key={comment.id} className={`${!comment.isRead ? "border-blue-200 bg-blue-50" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">项目 #{comment.projectId}</Badge>
                    <span className="font-medium">{comment.author}</span>
                    {comment.email && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        {comment.email}
                      </div>
                    )}
                    {!comment.isRead && (
                      <Badge variant="destructive" className="text-xs">
                        未读
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(comment.id, !comment.isRead)}>
                      {comment.isRead ? (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          标为未读
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          标为已读
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">暂无留言</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
