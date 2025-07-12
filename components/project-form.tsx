"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Project, ProjectStatus } from "@/lib/types"

interface ProjectFormProps {
  project: Project
  onSave: (project: Project) => void
  onCancel: () => void
}

const statusConfig = {
  planned: { label: "待规划", color: "bg-gray-200 text-gray-600" },
  planning: { label: "规划中", color: "bg-yellow-200 text-yellow-800" },
  developing: { label: "开发中", color: "bg-blue-200 text-blue-800" },
  completed: { label: "已完成", color: "bg-green-200 text-green-800" },
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>({
    ...project,
    updatedAt: new Date().toISOString(),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof Project, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          编辑项目 #{project.id}
          <Badge className={statusConfig[formData.status].color}>{statusConfig[formData.status].label}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">项目标题</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="输入项目标题"
                required
              />
            </div>
            <div>
              <Label htmlFor="status">项目状态</Label>
              <Select value={formData.status} onValueChange={(value: ProjectStatus) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">待规划</SelectItem>
                  <SelectItem value="planning">规划中</SelectItem>
                  <SelectItem value="developing">开发中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">项目描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="输入项目描述"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="link">演示链接</Label>
              <Input
                id="link"
                type="url"
                value={formData.link || ""}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub 链接</Label>
              <Input
                id="github"
                type="url"
                value={formData.github || ""}
                onChange={(e) => handleChange("github", e.target.value)}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">保存更改</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
